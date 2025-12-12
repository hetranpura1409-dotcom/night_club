import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Table } from '../../entities/table.entity';

@Injectable()
export class TablesService {
    constructor(
        @InjectRepository(Table)
        private tablesRepository: Repository<Table>,
    ) { }

    create(tableData: Partial<Table>): Promise<Table> {
        const table = this.tablesRepository.create(tableData);
        return this.tablesRepository.save(table);
    }

    findAll(): Promise<Table[]> {
        return this.tablesRepository.find({
            relations: ['nightclub'],
            order: { createdAt: 'DESC' },
        });
    }

    findByNightclub(nightclubId: string): Promise<Table[]> {
        return this.tablesRepository.find({
            where: { nightclubId, available: true },
            order: { date: 'ASC', time: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Table | null> {
        return this.tablesRepository.findOne({
            where: { id },
            relations: ['nightclub'],
        });
    }

    async update(id: string, updateData: Partial<Table>): Promise<Table> {
        await this.tablesRepository.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.tablesRepository.delete(id);
    }
}
