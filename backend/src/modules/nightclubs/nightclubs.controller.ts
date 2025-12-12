import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { NightclubsService } from './nightclubs.service';
import { CreateNightclubDto } from './dto/create-nightclub.dto';
import { UpdateNightclubDto } from './dto/update-nightclub.dto';

@Controller('nightclubs')
export class NightclubsController {
    constructor(private readonly nightclubsService: NightclubsService) { }

    @Post()
    create(@Body() createNightclubDto: CreateNightclubDto) {
        return this.nightclubsService.create(createNightclubDto);
    }

    @Get()
    findAll() {
        return this.nightclubsService.findAll();
    }

    @Get('featured')
    findFeatured() {
        return this.nightclubsService.findFeatured();
    }

    @Get('guestlist-only')
    findGuestlistOnly() {
        return this.nightclubsService.findGuestlistOnly();
    }

    @Get('popular/:city')
    findPopularByCity(@Param('city') city: string) {
        return this.nightclubsService.findPopularByCity(city);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.nightclubsService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateNightclubDto: UpdateNightclubDto,
    ) {
        return this.nightclubsService.update(id, updateNightclubDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.nightclubsService.remove(id);
    }
}
