'use client';

import { useState } from 'react';
import StarRating from './StarRating';

interface ReviewFormProps {
    nightclubId: string;
    onSubmit: (review: { rating: number; title: string; comment: string; visitDate: string }) => void;
    onCancel?: () => void;
}

export default function ReviewForm({ nightclubId, onSubmit, onCancel }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [visitDate, setVisitDate] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (rating === 0) {
            newErrors.rating = 'Please select a rating';
        }
        if (!comment.trim()) {
            newErrors.comment = 'Please write a review';
        }
        if (comment.length < 10) {
            newErrors.comment = 'Review must be at least 10 characters';
        }
        if (comment.length > 1000) {
            newErrors.comment = 'Review must be less than 1000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating) {
            alert('Please select a rating');
            return;
        }

        if (comment.trim().length < 10) {
            alert('Review must be at least 10 characters');
            return;
        }

        onSubmit({
            rating,
            title: title.trim() || '',
            comment: comment.trim(),
            visitDate: visitDate || undefined, // Send undefined instead of empty string
        });

        // Reset form
        setRating(0);
        setTitle('');
        setComment('');
        setVisitDate('');
    };

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <div className="form-section">
                <label>Your Rating *</label>
                <StarRating rating={rating} onRatingChange={setRating} size="large" />
                {errors.rating && <span className="error">{errors.rating}</span>}
            </div>

            <div className="form-section">
                <label>Review Title (Optional)</label>
                <input
                    type="text"
                    placeholder="Sum up your experience"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                />
            </div>

            <div className="form-section">
                <label>Your Review *</label>
                <textarea
                    placeholder="Share your experience with others..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    maxLength={1000}
                />
                <div className="char-count">{comment.length}/1000</div>
                {errors.comment && <span className="error">{errors.comment}</span>}
            </div>

            <div className="form-section">
                <label>Visit Date (Optional)</label>
                <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className="form-actions">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn-cancel">
                        Cancel
                    </button>
                )}
                <button type="submit" className="btn-submit">
                    Submit Review
                </button>
            </div>

            <style jsx>{`
                .review-form {
                    background: #1a1a1a;
                    padding: 24px;
                    border-radius: 16px;
                    border: 1px solid #333;
                }

                .form-section {
                    margin-bottom: 20px;
                }

                label {
                    display: block;
                    color: white;
                    font-weight: 600;
                    margin-bottom: 8px;
                    font-size: 14px;
                }

                input, textarea {
                    width: 100%;
                    background: #0a0a0a;
                    border: 1px solid #333;
                    padding: 12px;
                    border-radius: 8px;
                    color: white;
                    font-size: 14px;
                    font-family: inherit;
                }

                input:focus, textarea:focus {
                    outline: none;
                    border-color: #ff6b9d;
                }

                textarea {
                    resize: vertical;
                    min-height: 100px;
                }

                .char-count {
                    text-align: right;
                    font-size: 12px;
                    color: #888;
                    margin-top: 4px;
                }

                .error {
                    display: block;
                    color: #ff4757;
                    font-size: 12px;
                    margin-top: 4px;
                }

                .form-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                    margin-top: 24px;
                }

                .btn-cancel, .btn-submit {
                    padding: 12px 24px;
                    border-radius: 24px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s;
                    border: none;
                }

                .btn-cancel {
                    background: transparent;
                    border: 1px solid #666;
                    color: white;
                }

                .btn-cancel:hover {
                    border-color: #ff6b9d;
                }

                .btn-submit {
                    background: linear-gradient(135deg, #ff6b9d, #ff4181);
                    color: white;
                }

                .btn-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 107, 157, 0.4);
                }
            `}</style>
        </form>
    );
}
