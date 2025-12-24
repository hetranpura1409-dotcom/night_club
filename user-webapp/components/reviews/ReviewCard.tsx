'use client';

import StarRating from './StarRating';

interface ReviewCardProps {
    review: {
        id: string;
        rating: number;
        title: string;
        comment: string;
        visitDate: string;
        isVerified: boolean;
        helpfulCount: number;
        createdAt: string;
        user: {
            firstName: string;
            lastName: string;
        };
    };
    onMarkHelpful?: (reviewId: string) => void;
    onEdit?: (reviewId: string) => void;
    onDelete?: (reviewId: string) => void;
    isOwn?: boolean;
}

export default function ReviewCard({ review, onMarkHelpful, onEdit, onDelete, isOwn = false }: ReviewCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="review-card">
            <div className="review-header">
                <div className="user-info">
                    <div className="avatar">
                        {review.user.firstName[0]}{review.user.lastName[0]}
                    </div>
                    <div className="user-details">
                        <div className="user-name">
                            {review.user.firstName} {review.user.lastName}
                            {review.isVerified && <span className="verified-badge">✓ Verified Attendee</span>}
                        </div>
                        <div className="review-date">{formatDate(review.createdAt)}</div>
                    </div>
                </div>

                {isOwn && (
                    <div className="review-actions">
                        {onEdit && (
                            <button onClick={() => onEdit(review.id)} className="action-btn">
                                ✏️ Edit
                            </button>
                        )}
                        {onDelete && (
                            <button onClick={() => onDelete(review.id)} className="action-btn delete">
                                🗑️ Delete
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="review-rating">
                <StarRating rating={review.rating} readonly size="medium" />
                {review.visitDate && (
                    <span className="visit-date">Visited: {new Date(review.visitDate).toLocaleDateString()}</span>
                )}
            </div>

            {review.title && <h4 className="review-title">{review.title}</h4>}

            <p className="review-comment">{review.comment}</p>

            <div className="review-footer">
                {onMarkHelpful && (
                    <button onClick={() => onMarkHelpful(review.id)} className="helpful-btn">
                        👍 Helpful ({review.helpfulCount})
                    </button>
                )}
            </div>

            <style jsx>{`
                .review-card {
                    background: #1a1a1a;
                    padding: 20px;
                    border-radius: 12px;
                    border: 1px solid #333;
                    margin-bottom: 16px;
                }

                .review-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 12px;
                }

                .user-info {
                    display: flex;
                    gap: 12px;
                }

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ff6b9d, #c44dff);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: white;
                    font-size: 14px;
                }

                .user-details {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .user-name {
                    color: white;
                    font-weight: 600;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .verified-badge {
                    background: linear-gradient(135deg, #00d4aa, #00a8ff);
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 600;
                }

                .review-date {
                    color: #888;
                    font-size: 12px;
                }

                .review-actions {
                    display: flex;
                    gap: 8px;
                }

                .action-btn {
                    background: transparent;
                    border: 1px solid #666;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 16px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .action-btn:hover {
                    border-color: #ff6b9d;
                }

                .action-btn.delete:hover {
                    border-color: #ff4757;
                    color: #ff4757;
                }

                .review-rating {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .visit-date {
                    color: #888;
                    font-size: 12px;
                }

                .review-title {
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }

                .review-comment {
                    color: #ccc;
                    line-height: 1.6;
                    margin-bottom: 12px;
                    font-size: 14px;
                }

                .review-footer {
                    padding-top: 12px;
                    border-top: 1px solid #333;
                }

                .helpful-btn {
                    background: transparent;
                    border: 1px solid #666;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .helpful-btn:hover {
                    border-color: #ff6b9d;
                    background: rgba(255, 107, 157, 0.1);
                }
            `}</style>
        </div>
    );
}
