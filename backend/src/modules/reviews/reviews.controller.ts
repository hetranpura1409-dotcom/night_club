import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Post()
    createReview(
        @Body() body: {
            userId: string;
            nightclubId: string;
            rating: number;
            comment: string;
            title?: string;
            visitDate?: Date;
        },
    ) {
        return this.reviewsService.createReview(
            body.userId,
            body.nightclubId,
            body.rating,
            body.comment,
            body.title,
            body.visitDate,
        );
    }

    @Get('nightclub/:nightclubId')
    getReviewsByNightclub(
        @Param('nightclubId') nightclubId: string,
        @Query('sortBy') sortBy?: string,
    ) {
        return this.reviewsService.getReviewsByNightclub(nightclubId, sortBy);
    }

    @Get('user/:userId')
    getReviewsByUser(@Param('userId') userId: string) {
        return this.reviewsService.getReviewsByUser(userId);
    }

    @Get('stats/:nightclubId')
    getReviewStats(@Param('nightclubId') nightclubId: string) {
        return this.reviewsService.getReviewStats(nightclubId);
    }

    @Patch(':id')
    updateReview(
        @Param('id') id: string,
        @Body() body: {
            userId: string;
            rating?: number;
            comment?: string;
            title?: string;
        },
    ) {
        return this.reviewsService.updateReview(
            id,
            body.userId,
            body.rating,
            body.comment,
            body.title,
        );
    }

    @Delete(':id')
    deleteReview(@Param('id') id: string, @Body() body: { userId: string }) {
        return this.reviewsService.deleteReview(id, body.userId);
    }

    @Post(':id/helpful')
    markHelpful(@Param('id') id: string) {
        return this.reviewsService.markHelpful(id);
    }
}
