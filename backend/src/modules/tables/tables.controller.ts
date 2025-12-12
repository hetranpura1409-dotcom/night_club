import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
    constructor(private readonly tablesService: TablesService) { }

    @Post()
    create(@Body() createTableDto: any) {
        return this.tablesService.create(createTableDto);
    }

    @Get()
    findAll() {
        return this.tablesService.findAll();
    }

    @Get('nightclub/:nightclubId')
    findByNightclub(@Param('nightclubId') nightclubId: string) {
        return this.tablesService.findByNightclub(nightclubId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tablesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTableDto: any) {
        return this.tablesService.update(id, updateTableDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tablesService.remove(id);
    }
}
