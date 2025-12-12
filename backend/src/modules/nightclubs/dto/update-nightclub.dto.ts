import { PartialType } from '@nestjs/mapped-types';
import { CreateNightclubDto } from './create-nightclub.dto';

export class UpdateNightclubDto extends PartialType(CreateNightclubDto) { }
