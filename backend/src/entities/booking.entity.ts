import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Table } from './table.entity';
import { Nightclub } from './nightclub.entity';

export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    REFUNDED = 'refunded',
    FAILED = 'failed',
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    tableId: string;

    @ManyToOne(() => Table)
    @JoinColumn({ name: 'tableId' })
    table: Table;

    @Column()
    nightclubId: string;

    @ManyToOne(() => Nightclub)
    @JoinColumn({ name: 'nightclubId' })
    nightclub: Nightclub;

    @Column({ type: 'date' })
    bookingDate: string;

    @Column({ type: 'time' })
    bookingTime: string;

    @Column()
    numberOfGuests: number;

    @Column({ type: 'text', nullable: true })
    specialRequests: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    tablePrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    platformFee: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    paymentStatus: PaymentStatus;

    @Column({ nullable: true })
    paymentIntentId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    cancelledAt: Date;
}
