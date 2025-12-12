import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NightclubsService } from './nightclubs.service';
import { NightclubsController } from './nightclubs.controller';
import { Nightclub } from '../../entities/nightclub.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Nightclub])],
    controllers: [NightclubsController],
    providers: [NightclubsService],
    exports: [NightclubsService],
})
export class NightclubsModule { }
