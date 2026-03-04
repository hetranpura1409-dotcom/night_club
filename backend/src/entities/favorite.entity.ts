import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Nightclub } from './nightclub.entity';

@Entity('favorites')
@Unique(['userId', 'nightclubId'])
export class Favorite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    nightclubId: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Nightclub)
    @JoinColumn({ name: 'nightclubId' })
    nightclub: Nightclub;
}
