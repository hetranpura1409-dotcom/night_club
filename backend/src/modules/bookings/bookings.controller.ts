import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    // UseGuards,
    // Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
// @UseGuards(JwtAuthGuard) // TODO: Enable when JWT auth is set up
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    create(@Body() createBookingDto: CreateBookingDto) {
        // TODO: Get real userId from JWT
        const userId = 'temp-user-id';
        return this.bookingsService.createBooking(createBookingDto, userId);
    }

    @Patch(':id/confirm')
    confirm(@Param('id') id: string) {
        const userId = 'temp-user-id';
        return this.bookingsService.confirmBooking(id, userId);
    }

    @Get()
    getUserBookings() {
        const userId = 'temp-user-id';
        return this.bookingsService.getUserBookings(userId);
    }

    @Get(':id')
    getBooking(@Param('id') id: string) {
        const userId = 'temp-user-id';
        return this.bookingsService.getBookingById(id, userId);
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string) {
        const userId = 'temp-user-id';
        return this.bookingsService.cancelBooking(id, userId);
    }

    // Get QR code image for a booking
    @Get(':id/qrcode')
    getQRCode(@Param('id') id: string) {
        const userId = 'temp-user-id';
        return this.bookingsService.getBookingQRCode(id, userId);
    }

    // Verify QR code and check-in (for admin/door staff)
    @Post('verify-checkin')
    async verifyAndCheckIn(@Body('qrCode') qrCode: string) {
        return this.bookingsService.verifyAndCheckIn(qrCode);
    }

    // Get all bookings for a venue (admin)
    @Get('venue/:nightclubId')
    getVenueBookings(@Param('nightclubId') nightclubId: string) {
        return this.bookingsService.getVenueBookings(nightclubId);
    }
}
