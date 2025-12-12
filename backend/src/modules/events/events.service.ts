import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(Event)
        private eventsRepository: Repository<Event>,
    ) { }

    create(createEventDto: CreateEventDto): Promise<Event> {
        const event = this.eventsRepository.create(createEventDto);
        return this.eventsRepository.save(event);
    }

    findAll(): Promise<Event[]> {
        return this.eventsRepository.find({
            relations: ['nightclub'],
            order: { date: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Event> {
        const event = await this.eventsRepository.findOne({
            where: { id },
            relations: ['nightclub'],
        });
        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }

    async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
        const event = await this.findOne(id);
        Object.assign(event, updateEventDto);
        return this.eventsRepository.save(event);
    }

    async remove(id: string): Promise<void> {
        const event = await this.findOne(id);
        await this.eventsRepository.remove(event);
    }
}
