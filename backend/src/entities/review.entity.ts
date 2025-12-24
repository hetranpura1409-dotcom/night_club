import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
} from 'typeorm';

@Entity('reviews')
@Unique(['userId', 'nightclubId']) // One review per user per nightclub
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    nightclubId: string;

    @Column({ type: 'int' })
    rating: number; // 1-5 stars

    @Column({ type: 'varchar', length: 200, nullable: true })
    title: string;

    @Column({ type: 'text' })
    comment: string;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean; // True if user has attended (has booking)

    @Column({ type: 'int', default: 0 })
    helpfulCount: number;

    @Column({ type: 'date', nullable: true })
    visitDate: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
