'use client';

import { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import StarRating from './StarRating';

interface ReviewsListProps {
    nightclubId: string;
    reviews: any[];
    stats: {
        averageRating: number;
        totalReviews: number;
        distribution: Record<number, number>;
    };
    onMarkHelpful: (reviewId: string) => void;
    currentUserId?: string;
}

export default function ReviewsList({ nightclubId, reviews, stats, onMarkHelpful, currentUserId }: ReviewsListProps) {
    const [sortBy, setSortBy] = useState('recent');
    const [filterRating, setFilterRating] = useState<number | null>(null);

    const sortedReviews = [...reviews].sort((a, b) => {
        switch (sortBy) {
            case 'helpful':
                return b.helpfulCount - a.helpfulCount;
            case 'rating_high':
                return b.rating - a.rating;
            case 'rating_low':
                return a.rating - b.rating;
            case 'recent':
            default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    const filteredReviews = filterRating
        ? sortedReviews.filter((r) => r.rating === filterRating)
        : sortedReviews;

    const getPercentage = (rating: number) => {
        if (stats.totalReviews === 0) return 0;
        return Math.round((stats.distribution[rating] / stats.totalReviews) * 100);
    };

    return (
        <div className="reviews-list">
            {/* Rating Summary */}
            <div className="rating-summary">
                <div className="average-rating">
                    <div className="rating-number">{stats.averageRating.toFixed(1)}</div>
                    <StarRating rating={Math.round(stats.averageRating)} readonly size="large" />
                    <div className="total-reviews">{stats.totalReviews} reviews</div>
                </div>

                <div className="rating-distribution">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                            key={rating}
                            className={`distribution-bar ${filterRating === rating ? 'active' : ''}`}
                            onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                        >
                            <span className="rating-label">{rating}★</span>
                            <div className="bar-container">
                                <div
                                    className="bar-fill"
                                    style={{ width: `${getPercentage(rating)}%` }}
                                />
                            </div>
                            <span className="rating-count">{stats.distribution[rating]}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters & Sort */}
            <div className="reviews-controls">
                <div className="filter-info">
                    {filterRating ? (
                        <span>Showing {filterRating}-star reviews ({filteredReviews.length})</span>
                    ) : (
                        <span>All reviews ({reviews.length})</span>
                    )}
                    {filterRating && (
                        <button onClick={() => setFilterRating(null)} className="clear-filter">
                            Clear filter
                        </button>
                    )}
                </div>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                    <option value="recent">Most Recent</option>
                    <option value="rating_high">Highest Rated</option>
                    <option value="rating_low">Lowest Rated</option>
                    <option value="helpful">Most Helpful</option>
                </select>
            </div>

            {/* Reviews */}
            <div className="reviews-container">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onMarkHelpful={onMarkHelpful}
                            isOwn={review.userId === currentUserId}
                        />
                    ))
                ) : (
                    <div className="no-reviews">
                        No reviews yet. Be the first to review!
                    </div>
                )}
            </div>

            <style jsx>{`
                .reviews-list {
                    margin-top: 32px;
                }

                .rating-summary {
                    display: grid;
                    grid-template-columns: 200px 1fr;
                    gap: 32px;
                    padding: 24px;
                    background: #1a1a1a;
                    border-radius: 16px;
                    border: 1px solid #333;
                    margin-bottom: 24px;
                }

                .average-rating {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    padding: 16px;
                }

                .rating-number {
                    font-size: 48px;
                    font-weight: bold;
                    color: #ffa500;
                }

                .total-reviews {
                    color: #888;
                    font-size: 14px;
                }

                .rating-distribution {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .distribution-bar {
                    display: grid;
                    grid-template-columns: 40px 1fr 40px;
                    align-items: center;
                    gap: 12px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 4px 0;
                    transition: all 0.3s;
                }

                .distribution-bar:hover {
                    transform: scale(1.02);
                }

                .distribution-bar.active {
                    background: rgba(255, 107, 157, 0.1);
                    border-radius: 8px;
                    padding: 4px 8px;
                }

                .rating-label {
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                }

                .bar-container {
                    height: 8px;
                    background: #333;
                    border-radius: 4px;
                    overflow: hidden;
                }

                .bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #ffa500, #ff6b9d);
                    transition: width 0.3s ease;
                }

                .rating-count {
                    color: #888;
                    font-size: 13px;
                    text-align: right;
                }

                .reviews-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .filter-info {
                    color: white;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .clear-filter {
                    background: transparent;
                    border: 1px solid #666;
                    color: white;
                    padding: 4px 12px;
                    border-radius: 16px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .clear-filter:hover {
                    border-color: #ff6b9d;
                }

                .sort-select {
                    background: #1a1a1a;
                    border: 1px solid #333;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 13px;
                    cursor: pointer;
                }

                .sort-select:focus {
                    outline: none;
                    border-color: #ff6b9d;
                }

                .reviews-container {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .no-reviews {
                    text-align: center;
                    padding: 60px 20px;
                    color: #888;
                    font-size: 16px;
                }

                @media (max-width: 768px) {
                    .rating-summary {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
