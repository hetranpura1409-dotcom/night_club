import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
    imageUrl?: string;
}
