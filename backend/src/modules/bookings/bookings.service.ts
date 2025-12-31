import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Booking, BookingStatus, PaymentStatus } from '../../entities/booking.entity';
import { Payment, PaymentStatusEnum } from '../../entities/payment.entity';
import { Table } from '../../entities/table.entity';
import { StripeService } from '../../services/stripe.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import * as QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(Payment)
        private paymentsRepository: Repository<Payment>,
        @InjectRepository(Table)
        private tablesRepository: Repository<Table>,
        private stripeService: StripeService,
    ) { }

    async createBooking(createBookingDto: CreateBookingDto, userId: string) {
        // 1. Check if table exists and is available
        const table = await this.tablesRepository.findOne({
            where: { id: createBookingDto.tableId },
        });

        if (!table || !table.available) {
            throw new BadRequestException('Table not available');
        }

        // 2. Check for existing bookings at same time
        const existingBooking = await this.bookingsRepository.findOne({
            where: {
                tableId: createBookingDto.tableId,
                bookingDate: createBookingDto.bookingDate,
                bookingTime: createBookingDto.bookingTime,
                status: Not(BookingStatus.CANCELLED),
            },
        });

        if (existingBooking) {
            throw new BadRequestException('Table already booked for this time');
        }

        // 3. Calculate pricing
        const tablePrice = Number(table.price);
        const platformFeePercentage = Number(process.env.PLATFORM_FEE_PERCENTAGE) || 10;
        const platformFee = (tablePrice * platformFeePercentage) / 100;
        const totalAmount = tablePrice + platformFee;

        // 4. Create Stripe payment intent
        const paymentIntent = await this.stripeService.createPaymentIntent(totalAmount);

        // 5. Create booking
        const booking = this.bookingsRepository.create({
            userId,
            tableId: createBookingDto.tableId,
            nightclubId: table.nightclubId,
            bookingDate: createBookingDto.bookingDate,
            bookingTime: createBookingDto.bookingTime,
            numberOfGuests: createBookingDto.numberOfGuests,
            specialRequests: createBookingDto.specialRequests,
            tablePrice,
            platformFee,
            totalAmount,
            status: BookingStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING,
            paymentIntentId: paymentIntent.id,
        });

        await this.bookingsRepository.save(booking);

        return {
            booking,
            clientSecret: paymentIntent.client_secret,
        };
    }

    async confirmBooking(bookingId: string, userId: string) {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId, userId },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Verify payment with Stripe
        const paymentIntent = await this.stripeService.retrievePaymentIntent(
            booking.paymentIntentId,
        );

        if (paymentIntent.status === 'succeeded') {
            // Generate unique QR code
            const qrCodeData = uuidv4();
            booking.qrCode = qrCodeData;

            // Update booking status
            booking.status = BookingStatus.CONFIRMED;
            booking.paymentStatus = PaymentStatus.PAID;
            await this.bookingsRepository.save(booking);

            // Create payment record
            const payment = this.paymentsRepository.create({
                bookingId: booking.id,
                userId: booking.userId,
                amount: booking.totalAmount,
                currency: 'EUR',
                stripePaymentIntentId: paymentIntent.id,
                stripeChargeId: (paymentIntent as any).latest_charge || (paymentIntent as any).charges?.data?.[0]?.id,
                status: PaymentStatusEnum.SUCCEEDED,
                processedAt: new Date(),
            });
            await this.paymentsRepository.save(payment);

            return booking;
        } else {
            throw new BadRequestException('Payment not completed');
        }
    }

    async getUserBookings(userId: string) {
        return this.bookingsRepository.find({
            where: { userId },
            relations: ['table', 'nightclub'],
            order: { createdAt: 'DESC' },
        });
    }

    async getBookingById(bookingId: string, userId: string) {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId, userId },
            relations: ['table', 'nightclub'],
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        return booking;
    }

    async cancelBooking(bookingId: string, userId: string) {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId, userId },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.status === BookingStatus.CANCELLED) {
            throw new BadRequestException('Booking already cancelled');
        }

        // Check if booking is in the future
        const bookingDateTime = new Date(`${booking.bookingDate} ${booking.bookingTime}`);
        const now = new Date();

        if (bookingDateTime < now) {
            throw new BadRequestException('Cannot cancel past bookings');
        }

        // Process refund if paid
        if (booking.paymentStatus === PaymentStatus.PAID) {
            await this.stripeService.refundPayment(booking.paymentIntentId);
            booking.paymentStatus = PaymentStatus.REFUNDED;
        }

        booking.status = BookingStatus.CANCELLED;
        booking.cancelledAt = new Date();
        await this.bookingsRepository.save(booking);

        return booking;
    }

    // Generate QR code image as data URL
    async getBookingQRCode(bookingId: string, userId: string): Promise<string> {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId, userId },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (!booking.qrCode) {
            throw new BadRequestException('QR code not generated for this booking');
        }

        // Generate QR code as data URL
        const qrData = JSON.stringify({
            bookingId: booking.id,
            qrCode: booking.qrCode,
            nightclubId: booking.nightclubId,
            date: booking.bookingDate,
        });

        return await QRCode.toDataURL(qrData, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        });
    }

    // Verify QR code and check-in (for admin/door staff)
    async verifyAndCheckIn(qrCode: string) {
        const booking = await this.bookingsRepository.findOne({
            where: { qrCode },
            relations: ['user', 'table', 'nightclub'],
        });

        if (!booking) {
            throw new NotFoundException('Invalid QR code - Booking not found');
        }

        if (booking.status !== BookingStatus.CONFIRMED) {
            throw new BadRequestException(`Booking is ${booking.status}, not confirmed`);
        }

        if (booking.checkedIn) {
            return {
                success: false,
                message: 'Already checked in',
                checkedInAt: booking.checkedInAt,
                booking,
            };
        }

        // Check-in the guest
        booking.checkedIn = true;
        booking.checkedInAt = new Date();
        await this.bookingsRepository.save(booking);

        return {
            success: true,
            message: 'Check-in successful!',
            checkedInAt: booking.checkedInAt,
            booking,
        };
    }

    // Get all bookings for a venue (admin)
    async getVenueBookings(nightclubId: string) {
        return this.bookingsRepository.find({
            where: { nightclubId },
            relations: ['user', 'table'],
            order: { bookingDate: 'DESC', bookingTime: 'DESC' },
        });
    }
}
