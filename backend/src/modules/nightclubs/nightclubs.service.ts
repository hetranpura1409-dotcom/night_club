import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Nightclub } from '../../entities/nightclub.entity';
import { CreateNightclubDto } from './dto/create-nightclub.dto';
import { UpdateNightclubDto } from './dto/update-nightclub.dto';

@Injectable()
export class NightclubsService {
    constructor(
        @InjectRepository(Nightclub)
        private nightclubsRepository: Repository<Nightclub>,
    ) { }

    create(createNightclubDto: CreateNightclubDto): Promise<Nightclub> {
        const nightclub = this.nightclubsRepository.create(createNightclubDto);
        return this.nightclubsRepository.save(nightclub);
    }

    findAll(): Promise<Nightclub[]> {
        return this.nightclubsRepository.find({
            relations: ['events'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Nightclub> {
        const nightclub = await this.nightclubsRepository.findOne({
            where: { id },
            relations: ['events'],
        });
        if (!nightclub) {
            throw new NotFoundException(`Nightclub with ID ${id} not found`);
        }
        return nightclub;
    }

    async update(
        id: string,
        updateNightclubDto: UpdateNightclubDto,
    ): Promise<Nightclub> {
        const nightclub = await this.findOne(id);
        Object.assign(nightclub, updateNightclubDto);
        return this.nightclubsRepository.save(nightclub);
    }

    async remove(id: string): Promise<void> {
        const nightclub = await this.findOne(id);
        await this.nightclubsRepository.remove(nightclub);
    }

    // New methods for browse page sections
    findFeatured(): Promise<Nightclub[]> {
        return this.nightclubsRepository.find({
            where: { isFeatured: true },
            relations: ['events'],
            order: { rating: 'DESC' },
            take: 6,
        });
    }

    findPopularByCity(city: string): Promise<Nightclub[]> {
        return this.nightclubsRepository.find({
            where: { city },
            relations: ['events'],
            order: { rating: 'DESC' },
            take: 6,
        });
    }

    findGuestlistOnly(): Promise<Nightclub[]> {
        return this.nightclubsRepository.find({
            where: { isGuestlistOnly: true },
            relations: ['events'],
            order: { rating: 'DESC' },
            take: 6,
        });
    }
}

