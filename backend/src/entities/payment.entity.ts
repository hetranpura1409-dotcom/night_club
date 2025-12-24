import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum PaymentStatusEnum {
    PENDING = 'pending',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    bookingId: string;

    @Column()
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ default: 'EUR' })
    currency: string;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ nullable: true, unique: true })
    stripePaymentIntentId: string;

    @Column({ nullable: true })
    stripeCustomerId: string;

    @Column({ nullable: true })
    stripeChargeId: string;

    @Column({
        type: 'enum',
        enum: PaymentStatusEnum,
        default: PaymentStatusEnum.PENDING,
    })
    status: PaymentStatusEnum;

    @Column({ type: 'text', nullable: true })
    errorMessage: string;

    @Column({ type: 'text', nullable: true })
    receiptUrl: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    processedAt: Date;
}
