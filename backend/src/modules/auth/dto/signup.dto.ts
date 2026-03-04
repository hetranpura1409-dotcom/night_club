import { IsString, IsNotEmpty, IsEmail, Matches, MinLength, MaxLength, IsOptional } from 'class-validator';

export class SignUpDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    firstName?: string;

    @IsString()
    @IsOptional()
    @MinLength(2)
    @MaxLength(50)
    lastName?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^\+?[0-9]{7,15}$/, { message: 'Please enter a valid mobile number (7-15 digits, optional + prefix)' })
    mobile: string;

    @IsString()
    @IsOptional()
    @MinLength(8)
    @MaxLength(100)
    password?: string;
}
