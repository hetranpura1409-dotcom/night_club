import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Nightclub } from './nightclub.entity';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('timestamp')
    date: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    imageUrl: string;

    @Column()
    nightclubId: string;

    @ManyToOne(() => Nightclub, (nightclub) => nightclub.events, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'nightclubId' })
    nightclub: Nightclub;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
