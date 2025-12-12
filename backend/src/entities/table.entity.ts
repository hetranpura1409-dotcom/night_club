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

@Entity('tables')
export class Table {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    capacity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    date: string;

    @Column()
    time: string;

    @Column({ default: true })
    available: boolean;

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
