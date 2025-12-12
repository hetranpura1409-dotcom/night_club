import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsUrl,
    IsDateString,
    IsNumber,
    IsUUID,
} from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsString()
    @IsOptional()
    @IsUrl()
    imageUrl?: string;

    @IsUUID()
    @IsNotEmpty()
    nightclubId: string;
}
