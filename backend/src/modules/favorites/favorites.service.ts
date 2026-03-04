import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../../entities/favorite.entity';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite)
        private favoriteRepository: Repository<Favorite>,
    ) { }

    async getUserFavorites(userId: string): Promise<Favorite[]> {
        return await this.favoriteRepository.find({
            where: { userId },
            relations: ['nightclub'],
            order: { createdAt: 'DESC' },
        });
    }

    async addFavorite(userId: string, nightclubId: string): Promise<Favorite> {
        // Check if already favorited
        const existing = await this.favoriteRepository.findOne({
            where: { userId, nightclubId },
        });
        if (existing) {
            return existing;
        }

        const favorite = this.favoriteRepository.create({ userId, nightclubId });
        return await this.favoriteRepository.save(favorite);
    }

    async removeFavorite(userId: string, nightclubId: string): Promise<void> {
        const favorite = await this.favoriteRepository.findOne({
            where: { userId, nightclubId },
        });
        if (!favorite) {
            throw new NotFoundException('Favorite not found');
        }
        await this.favoriteRepository.remove(favorite);
    }

    async isFavorite(userId: string, nightclubId: string): Promise<boolean> {
        const count = await this.favoriteRepository.count({
            where: { userId, nightclubId },
        });
        return count > 0;
    }
}
