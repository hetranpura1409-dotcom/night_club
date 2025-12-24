import { IsString, IsNumber, IsOptional, Min, Max, Matches } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    tableId: string;

    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Date must be in YYYY-MM-DD format' })
    bookingDate: string;

    @IsString()
    @Matches(/^\d{2}:\d{2}$/, { message: 'Time must be in HH:MM format' })
    bookingTime: string;

    @IsNumber()
    @Min(1)
    @Max(20)
    numberOfGuests: number;

    @IsOptional()
    @IsString()
    specialRequests?: string;
}
