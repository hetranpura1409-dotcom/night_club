import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { Booking } from '../../entities/booking.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private reviewsRepository: Repository<Review>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
    ) { }

    async createReview(
        userId: string,
        nightclubId: string,
        rating: number,
        comment: string,
        title?: string,
        visitDate?: Date,
    ) {
        // Check if user already reviewed this nightclub
        const existing = await this.reviewsRepository.findOne({
            where: { userId, nightclubId },
        });

        if (existing) {
            throw new ConflictException('You have already reviewed this nightclub');
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new ConflictException('Rating must be between 1 and 5');
        }

        // Check if user has attended (has a booking)
        const hasBooking = await this.bookingsRepository.findOne({
            where: {
                userId,
                nightclub: { id: nightclubId },
            },
        });

        const review = this.reviewsRepository.create({
            userId,
            nightclubId,
            rating,
            comment,
            title,
            visitDate,
            isVerified: !!hasBooking,
        });

        return await this.reviewsRepository.save(review);
    }

    async getReviewsByNightclub(nightclubId: string, sortBy: string = 'recent') {
        const query = this.reviewsRepository
            .createQueryBuilder('review')
            .where('review.nightclubId = :nightclubId', { nightclubId });

        // Sort options
        switch (sortBy) {
            case 'helpful':
                query.orderBy('review.helpfulCount', 'DESC');
                break;
            case 'rating_high':
                query.orderBy('review.rating', 'DESC');
                break;
            case 'rating_low':
                query.orderBy('review.rating', 'ASC');
                break;
            case 'recent':
            default:
                query.orderBy('review.createdAt', 'DESC');
                break;
        }

        const reviews = await query.getMany();

        // Manually attach user data (firstName and lastName from hardcoded user)
        return reviews.map(review => ({
            ...review,
            user: {
                firstName: 'Guest',
                lastName: 'User',
            }
        }));
    }

    async getReviewsByUser(userId: string) {
        return await this.reviewsRepository.find({
            where: { userId },
            relations: ['nightclub'],
            order: { createdAt: 'DESC' },
        });
    }

    async updateReview(
        reviewId: string,
        userId: string,
        rating?: number,
        comment?: string,
        title?: string,
    ) {
        const review = await this.reviewsRepository.findOne({
            where: { id: reviewId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.userId !== userId) {
            throw new ForbiddenException('You can only edit your own reviews');
        }

        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                throw new ConflictException('Rating must be between 1 and 5');
            }
            review.rating = rating;
        }

        if (comment !== undefined) review.comment = comment;
        if (title !== undefined) review.title = title;

        return await this.reviewsRepository.save(review);
    }

    async deleteReview(reviewId: string, userId: string) {
        const review = await this.reviewsRepository.findOne({
            where: { id: reviewId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.userId !== userId) {
            throw new ForbiddenException('You can only delete your own reviews');
        }

        await this.reviewsRepository.remove(review);
        return { message: 'Review deleted successfully' };
    }

    async markHelpful(reviewId: string) {
        const review = await this.reviewsRepository.findOne({
            where: { id: reviewId },
        });

        if (!review) {
            throw new NotFoundException('Review not found');
        }

        review.helpfulCount += 1;
        return await this.reviewsRepository.save(review);
    }

    async getReviewStats(nightclubId: string) {
        const reviews = await this.reviewsRepository.find({
            where: { nightclubId },
        });

        if (reviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            };
        }

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / reviews.length;

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((review) => {
            distribution[review.rating]++;
        });

        return {
            averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
            totalReviews: reviews.length,
            distribution,
        };
    }
}
