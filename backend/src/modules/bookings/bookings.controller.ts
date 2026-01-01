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

// Demo user ID - in production, this would come from JWT auth
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

@Controller('bookings')
// @UseGuards(JwtAuthGuard) // TODO: Enable when JWT auth is set up
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    create(@Body() createBookingDto: CreateBookingDto) {
        // TODO: Get real userId from JWT
        const userId = DEMO_USER_ID;
        return this.bookingsService.createBooking(createBookingDto, userId);
    }

    @Patch(':id/confirm')
    confirm(@Param('id') id: string) {
        const userId = DEMO_USER_ID;
        return this.bookingsService.confirmBooking(id, userId);
    }

    @Get()
    getUserBookings() {
        const userId = DEMO_USER_ID;
        return this.bookingsService.getUserBookings(userId);
    }

    @Get(':id')
    getBooking(@Param('id') id: string) {
        const userId = DEMO_USER_ID;
        return this.bookingsService.getBookingById(id, userId);
    }

    @Patch(':id/cancel')
    cancel(@Param('id') id: string) {
        const userId = DEMO_USER_ID;
        return this.bookingsService.cancelBooking(id, userId);
    }

    // Get QR code image for a booking
    @Get(':id/qrcode')
    getQRCode(@Param('id') id: string) {
        const userId = DEMO_USER_ID;
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

    // Get all bookings for admin dashboard
    @Get('admin/all')
    getAllBookingsAdmin() {
        return this.bookingsService.getAllBookingsAdmin();
    }
}
