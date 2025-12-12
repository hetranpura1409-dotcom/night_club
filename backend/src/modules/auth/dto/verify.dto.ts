import { IsString, IsNotEmpty, Length } from 'class-validator';

export class VerifyDto {
    @IsString()
    @IsNotEmpty()
    mobile: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 6)
    code: string;
}
