'use client';

import { useState } from 'react';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export default function StarRating({ rating, onRatingChange, readonly = false, size = 'medium' }: StarRatingProps) {
    const [hoverRating, setHoverRating] = useState(0);

    const sizes = {
        small: '16px',
        medium: '24px',
        large: '32px',
    };

    const handleClick = (value: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    const handleMouseEnter = (value: number) => {
        if (!readonly) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const displayRating = hoverRating || rating;

    return (
        <div className="star-rating" onMouseLeave={handleMouseLeave}>
            {[1, 2, 3, 4, 5].map((value) => (
                <span
                    key={value}
                    className={`star ${value <= displayRating ? 'filled' : 'empty'} ${!readonly ? 'interactive' : ''}`}
                    onClick={() => handleClick(value)}
                    onMouseEnter={() => handleMouseEnter(value)}
                    style={{ fontSize: sizes[size] }}
                >
                    {value <= displayRating ? '★' : '☆'}
                </span>
            ))}

            <style jsx>{`
                .star-rating {
                    display: inline-flex;
                    gap: 4px;
                }

                .star {
                    transition: all 0.2s ease;
                }

                .star.filled {
                    color: #ffa500;
                }

                .star.empty {
                    color: #444;
                }

                .star.interactive {
                    cursor: pointer;
                }

                .star.interactive:hover {
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
}
