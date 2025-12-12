import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Event } from './event.entity';

@Entity('nightclubs')
export class Nightclub {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column()
    location: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    category: string;

    @Column({ default: false })
    isFeatured: boolean;

    @Column({ default: false })
    isGuestlistOnly: boolean;

    @Column('decimal', { precision: 2, scale: 1, nullable: true })
    rating: number;

    @Column({ nullable: true })
    priceRange: string;

    @OneToMany(() => Event, (event) => event.nightclub)
    events: Event[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

