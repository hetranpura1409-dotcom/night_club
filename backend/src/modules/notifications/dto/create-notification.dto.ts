import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsUUID()
    @IsNotEmpty()
    userId: string;
}
