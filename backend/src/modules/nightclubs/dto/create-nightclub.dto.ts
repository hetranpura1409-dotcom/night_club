import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateNightclubDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsOptional()
    @IsUrl()
    imageUrl?: string;
}
