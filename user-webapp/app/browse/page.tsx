'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getNightclubs, getEvents, getFeaturedNightclubs, getPopularNightclubs, getGuestlistOnlyNightclubs, getUpcomingEvents, addFavorite, removeFavorite, getReviewStats } from '../../services/api';

interface Nightclub {
    id: string;
    name: string;
    description: string;
    location: string;
    imageUrl: string;
    city?: string;
    category?: string;
    isFeatured?: boolean;
    isGuestlistOnly?: boolean;
    rating?: number;
    priceRange?: string;
}

interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    price: number;
    imageUrl: string;
    nightclubId: string;
    nightclub?: Nightclub;
}

export default function BrowsePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('Home');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [reviewStats, setReviewStats] = useState<Record<string, { averageRating: number; totalReviews: number }>>({});

    const [featuredClubs, setFeaturedClubs] = useState<Nightclub[]>([]);
    const [popularClubs, setPopularClubs] = useState<Nightclub[]>([]);
    const [guestlistClubs, setGuestlistClubs] = useState<Nightclub[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [allClubs, setAllClubs] = useState<Nightclub[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    const filters = ['Home', 'Night Clubs', 'Events', 'Popular'];
    const defaultCity = 'Stockholm';

    // Toggle favorite function
    const toggleFavorite = async (e: React.MouseEvent, nightclubId: string) => {
        e.stopPropagation(); // Prevent navigation to venue page

        const isFavorited = favorites.has(nightclubId);

        // Optimistic update
        setFavorites(prev => {
            const newSet = new Set(prev);
            if (isFavorited) {
                newSet.delete(nightclubId);
            } else {
                newSet.add(nightclubId);
            }
            return newSet;
        });

        try {
            if (isFavorited) {
                await removeFavorite(nightclubId);
            } else {
                await addFavorite(nightclubId);
            }
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            // Revert on error
            setFavorites(prev => {
                const newSet = new Set(prev);
                if (isFavorited) {
                    newSet.add(nightclubId);
                } else {
                    newSet.delete(nightclubId);
                }
                return newSet;
            });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/');
            return;
        }

        setUser(JSON.parse(userData));

        const parsedUser = JSON.parse(userData);
        if (parsedUser?.id) {
            loadNotifications(parsedUser.id);
        }

        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setProfileImage(savedImage);
        }

        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [allData, featured, popular, guestlist, events] = await Promise.all([
                getNightclubs(),
                getFeaturedNightclubs().catch(() => []),
                getPopularNightclubs(defaultCity).catch(() => []),
                getGuestlistOnlyNightclubs().catch(() => []),
                getUpcomingEvents().catch(() => []),
            ]);

            setAllClubs(allData);
            setFeaturedClubs(featured.length > 0 ? featured : allData.slice(0, 4));
            setPopularClubs(popular.length > 0 ? popular : allData.slice(0, 4));
            setGuestlistClubs(guestlist.length > 0 ? guestlist : allData.slice(0, 2));
            setUpcomingEvents(events);

            // Load review stats for all clubs
            const allClubIds = allData.map((c: Nightclub) => c.id);
            if (allClubIds.length > 0) {
                await loadReviewStats(allClubIds);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Load review stats for all clubs
    const loadReviewStats = async (clubIds: string[]) => {
        try {
            const stats: Record<string, { averageRating: number; totalReviews: number }> = {};
            await Promise.all(
                clubIds.map(async (id) => {
                    try {
                        const reviewData = await getReviewStats(id);
                        stats[id] = {
                            averageRating: reviewData.averageRating,
                            totalReviews: reviewData.totalReviews,
                        };
                    } catch (err) {
                        // No reviews yet
                        stats[id] = { averageRating: 0, totalReviews: 0 };
                    }
                })
            );
            setReviewStats(stats);
        } catch (error) {
            console.error('Error loading review stats:', error);
        }
    };

    // Load unread notifications count
    const loadNotifications = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/api/notifications/user/${userId}`);
            const notifications = await response.json();
            const unreadCount = notifications.filter((n: any) => !n.isRead).length;
            setUnreadNotifications(unreadCount);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    // Get display rating (review-based or fallback to static)
    const getDisplayRating = (clubId: string, staticRating?: number) => {
        const stats = reviewStats[clubId];
        if (stats && stats.totalReviews > 0) {
            return {
                rating: stats.averageRating,
                count: stats.totalReviews,
                isReviewBased: true,
            };
        }
        return {
            rating: staticRating || 0,
            count: 0,
            isReviewBased: false,
        };
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    const formatPrice = (price: number) => `$${Number(price).toFixed(0)}`;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Filter function for search
    const filterBySearch = (clubs: Nightclub[]) => {
        if (!searchQuery.trim()) return clubs;
        const query = searchQuery.toLowerCase();
        return clubs.filter(club =>
            club.name.toLowerCase().includes(query) ||
            club.location?.toLowerCase().includes(query) ||
            club.category?.toLowerCase().includes(query) ||
            club.description?.toLowerCase().includes(query)
        );
    };

    const filterEventsBySearch = (events: Event[]) => {
        if (!searchQuery.trim()) return events;
        const query = searchQuery.toLowerCase();
        return events.filter(event =>
            event.name.toLowerCase().includes(query) ||
            event.description?.toLowerCase().includes(query) ||
            event.nightclub?.name?.toLowerCase().includes(query)
        );
    };

    // Filtered data
    const filteredFeatured = filterBySearch(featuredClubs);
    const filteredPopular = filterBySearch(popularClubs);
    const filteredGuestlist = filterBySearch(guestlistClubs);
    const filteredEvents = filterEventsBySearch(upcomingEvents);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading...</p>
                <style jsx>{`
                    .loading-container {
                        min-height: 100vh;
                        background: #000000;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: white;
                    }
                    .spinner {
                        width: 40px;
                        height: 40px;
                        border: 3px solid rgba(255,255,255,0.1);
                        border-top-color: #ff6b9d;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="browse-container">
            {/* Header */}
            <div className="header">
                <div className="user-greeting">
                    <div
                        className="profile-avatar"
                        onClick={() => router.push('/profile')}
                    >
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" />
                        ) : (
                            <span>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</span>
                        )}
                    </div>
                    <div className="greeting-text">
                        <span className="greeting">{getGreeting()} 👋</span>
                        <span className="user-name">{user?.firstName}</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="notification-btn" onClick={() => router.push('/notifications')}>
                        🔔
                        {unreadNotifications > 0 && (
                            <span className="notification-badge">{unreadNotifications}</span>
                        )}
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-section">
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="What club are you looking for..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Chips */}
            <div className="filters">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </div>


            {/* What we think you would like */}
            {(activeFilter === 'Home' || activeFilter === 'Night Clubs') && (
                <section className="section">
                    <h2 className="section-title">What we think you would like...</h2>
                    <div className="horizontal-scroll">
                        {filteredFeatured.map((club) => (
                            <div
                                key={club.id}
                                className="venue-card"
                                onClick={() => router.push(`/venue/${club.id}`)}
                            >
                                <div className="venue-image">
                                    {club.imageUrl ? (
                                        <img src={club.imageUrl} alt={club.name} />
                                    ) : (
                                        <div className="placeholder-image">🎵</div>
                                    )}
                                    <span className="price-tag">{club.priceRange || '$$$'}</span>
                                </div>
                                <div className="venue-info">
                                    <h3>{club.name}</h3>
                                    <p>{club.category || 'Nightclub'} • {club.location}</p>
                                    <div className="rating-row">
                                        {(() => {
                                            const { rating, count, isReviewBased } = getDisplayRating(club.id, club.rating);
                                            if (rating > 0) {
                                                return (
                                                    <div className="rating">
                                                        {'★'.repeat(Math.floor(rating))}
                                                        {'☆'.repeat(5 - Math.floor(rating))}
                                                        {isReviewBased && count > 0 && (
                                                            <span className="review-count"> ({count} reviews)</span>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return <span className="no-reviews">No reviews yet</span>;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Promo Banner 1 */}
            {activeFilter === 'Home' && (
                <div className="promo-banner pink">
                    <div className="promo-content">
                        <p className="promo-title">Book now.</p>
                        <p className="promo-subtitle">Pay later with <strong>Klarna.</strong></p>
                    </div>
                </div>
            )}

            {/* Popular in City */}
            {(activeFilter === 'Home' || activeFilter === 'Popular' || activeFilter === 'Night Clubs') && (
                <section className="section">
                    <h2 className="section-title">Popular in {defaultCity} 🔥</h2>
                    <div className="grid-2col">
                        {filteredPopular.slice(0, 4).map((club) => (
                            <div
                                key={club.id}
                                className="venue-card-grid"
                                onClick={() => router.push(`/venue/${club.id}`)}
                            >
                                <div className="venue-image">
                                    {club.imageUrl ? (
                                        <img src={club.imageUrl} alt={club.name} />
                                    ) : (
                                        <div className="placeholder-image">🎵</div>
                                    )}
                                </div>
                                <div className="venue-info">
                                    <h3>{club.name}</h3>
                                    <div className="rating">
                                        {(() => {
                                            const { rating, count, isReviewBased } = getDisplayRating(club.id, club.rating);
                                            if (rating > 0) {
                                                return (
                                                    <>
                                                        {'★'.repeat(Math.floor(rating))}
                                                        {'☆'.repeat(5 - Math.floor(rating))}
                                                        {isReviewBased && count > 0 && (
                                                            <span className="review-count"> ({count})</span>
                                                        )}
                                                    </>
                                                );
                                            }
                                            return <span className="no-reviews">No reviews yet</span>;
                                        })()}
                                    </div>
                                    <p>{club.category || 'Nightclub'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Guestlist Only */}
            {(activeFilter === 'Home' || activeFilter === 'Night Clubs') && (
                <section className="section">
                    <h2 className="section-title">Guestlist only</h2>
                    <div className="horizontal-scroll">
                        {filteredGuestlist.map((club) => (
                            <div
                                key={club.id}
                                className="venue-card"
                                onClick={() => router.push(`/venue/${club.id}`)}
                            >
                                <div className="venue-image">
                                    {club.imageUrl ? (
                                        <img src={club.imageUrl} alt={club.name} />
                                    ) : (
                                        <div className="placeholder-image">🎵</div>
                                    )}
                                    <span className="price-tag">{club.priceRange || '$$$'}</span>
                                </div>
                                <div className="venue-info">
                                    <h3>{club.name}</h3>
                                    <p>{club.category || 'Exclusive'} • {club.location}</p>
                                    <div className="rating-row">
                                        {(() => {
                                            const { rating, count, isReviewBased } = getDisplayRating(club.id, club.rating);
                                            if (rating > 0) {
                                                return (
                                                    <div className="rating">
                                                        {'★'.repeat(Math.floor(rating))}
                                                        {'☆'.repeat(5 - Math.floor(rating))}
                                                        {isReviewBased && count > 0 && (
                                                            <span className="review-count"> ({count} reviews)</span>
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return <span className="no-reviews">No reviews yet</span>;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* All Nightclubs */}
            {(activeFilter === 'Home' || activeFilter === 'Night Clubs') && (
                <section className="section">
                    <h2 className="section-title">All nightclubs</h2>
                    <div className="clubs-grid">
                        {allClubs.filter(club => {
                            if (!searchQuery.trim()) return true;
                            const query = searchQuery.toLowerCase();
                            return club.name.toLowerCase().includes(query) ||
                                club.location?.toLowerCase().includes(query) ||
                                club.category?.toLowerCase().includes(query);
                        }).map((club) => (
                            <div
                                key={club.id}
                                className="club-card"
                                onClick={() => router.push(`/venue/${club.id}`)}
                            >
                                <div className="club-image">
                                    {club.imageUrl ? (
                                        <img src={club.imageUrl} alt={club.name} />
                                    ) : (
                                        <div className="placeholder-image">🎵</div>
                                    )}
                                </div>
                                <div className="club-info">
                                    <h3>{club.name}</h3>
                                    <p className="club-location">📍 {club.location}</p>
                                    <div className="rating-row">
                                        {(() => {
                                            const { rating, count, isReviewBased } = getDisplayRating(club.id, club.rating);
                                            if (isReviewBased && count > 0) {
                                                return (
                                                    <>
                                                        <span className="rating-stars">{'★'.repeat(Math.round(rating))}</span>
                                                        <span className="review-count">({count} reviews)</span>
                                                    </>
                                                );
                                            } else if (rating > 0) {
                                                return (
                                                    <>
                                                        <span className="rating-stars">{'★'.repeat(Math.round(rating))}</span>
                                                        <span className="review-count">({rating.toFixed(1)})</span>
                                                    </>
                                                );
                                            }
                                            return <span className="no-reviews">No reviews yet</span>;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Promo Banner 2 */}
            {activeFilter === 'Home' && (
                <div className="promo-banner dark">
                    <div className="promo-content centered">
                        <span className="mastercard-logo">●●</span>
                        <p>Your<span className="highlight-red">true</span><span className="highlight-yellow">self</span> is <strong>Priceless</strong></p>
                    </div>
                </div>
            )}

            {/* Upcoming Events */}
            {(activeFilter === 'Home' || activeFilter === 'Events') && (
                <section className="section">
                    <h2 className="section-title">Upcoming events</h2>
                    <div className="events-list">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map((event) => (
                                <div key={event.id} className="event-card">
                                    <div className="event-image">
                                        {event.imageUrl ? (
                                            <img src={event.imageUrl} alt={event.name} />
                                        ) : (
                                            <div className="placeholder-image">🎉</div>
                                        )}
                                        <button className="favorite-btn">♡</button>
                                    </div>
                                    <div className="event-info">
                                        <h3>{event.name}</h3>
                                        <p className="event-venue">📍 {event.nightclub?.name || 'Venue'}</p>
                                        <p className="event-date">{formatDate(event.date)}</p>
                                    </div>
                                    <div className="event-price">
                                        {formatPrice(event.price)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-events">No upcoming events</p>
                        )}
                    </div>
                </section>
            )}


            <style jsx>{`
                .browse-container {
                    min-height: 100vh;
                    background: #000000;
                    padding: 20px;
                    padding-bottom: 40px;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .user-greeting {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .profile-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ff6b9d, #c44dff);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    overflow: hidden;
                    font-weight: bold;
                    color: white;
                }

                .profile-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .greeting-text {
                    display: flex;
                    flex-direction: column;
                }

                .greeting {
                    font-size: 12px;
                    color: #888;
                }

                .user-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: white;
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .favorites-link-btn {
                    background: linear-gradient(135deg, #ff6b9d, #ff4181);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .favorites-link-btn span {
                    color: white;
                    font-size: 13px;
                    font-weight: 600;
                }

                .favorites-link-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
                }

                .notification-btn {
                    position: relative;
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 10px 16px;
                    border-radius: 20px;
                    font-size: 18px;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                }

                .notification-btn:hover {
                    background: rgba(255, 107, 157, 0.1);
                    border-color: #ff6b9d;
                }

                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: linear-gradient(135deg, #ff6b9d, #ff4181);
                    color: white;
                    font-size: 11px;
                    font-weight: bold;
                    padding: 2px 6px;
                    border-radius: 10px;
                    min-width: 18px;
                    text-align: center;
                }

                .logout-btn {
                    background: linear-gradient(135deg, #ff4757, #ff6b81);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .logout-btn span {
                    color: white;
                    font-size: 13px;
                    font-weight: 600;
                }

                .logout-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
                }

                .logout-btn:active {
                    transform: scale(0.95);
                }

                .search-section {
                    margin-bottom: 16px;
                }

                .search-bar {
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 12px;
                    padding: 12px 16px;
                    gap: 12px;
                }

                .search-icon {
                    font-size: 16px;
                    opacity: 0.5;
                }

                .search-bar input {
                    flex: 1;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 14px;
                    outline: none;
                }

                .search-bar input::placeholder {
                    color: #666;
                }

                .filters {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 24px;
                    overflow-x: auto;
                    padding-bottom: 4px;
                }

                .filter-chip {
                    padding: 8px 16px;
                    border-radius: 20px;
                    border: 1px solid #333;
                    background: transparent;
                    color: #888;
                    font-size: 13px;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.3s ease;
                }

                .filter-chip:hover {
                    border-color: #666;
                    color: white;
                    transform: translateY(-2px);
                }

                .filter-chip.active {
                    background: white;
                    color: black;
                    border-color: white;
                }

                .section {
                    margin-bottom: 28px;
                }

                .section-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: white;
                    margin: 0 0 16px 0;
                }

                .horizontal-scroll {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    padding-bottom: 8px;
                    scroll-snap-type: x mandatory;
                }

                .horizontal-scroll::-webkit-scrollbar {
                    display: none;
                }

                .venue-card {
                    min-width: 160px;
                    flex-shrink: 0;
                    scroll-snap-align: start;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .venue-card:hover {
                    transform: translateY(-4px);
                }

                .venue-image {
                    position: relative;
                    width: 100%;
                    height: 100px;
                    border-radius: 12px;
                    overflow: hidden;
                    background: #1a1a1a;
                }

                .venue-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .placeholder-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
                }

                .price-tag {
                    position: absolute;
                    bottom: 8px;
                    right: 8px;
                    background: rgba(0, 0, 0, 0.7);
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 11px;
                    color: white;
                }

                .favorite-btn {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: rgba(0, 0, 0, 0.5);
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    color: white;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .favorite-btn:hover {
                    background: rgba(255, 71, 87, 0.8);
                    transform: scale(1.1);
                }

                .favorite-btn:active {
                    transform: scale(0.9);
                }

                .venue-info {
                    padding: 8px 0;
                }

                .venue-info h3 {
                    font-size: 14px;
                    font-weight: 600;
                    color: white;
                    margin: 0 0 4px 0;
                }

                .venue-info p {
                    font-size: 11px;
                    color: #888;
                    margin: 0;
                }

                .rating {
                    color: #ff6b9d;
                    font-size: 12px;
                    margin-bottom: 4px;
                }

                .grid-2col {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                }

                .venue-card-grid {
                    background: #111;
                    border-radius: 12px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .venue-card-grid:hover {
                    transform: translateY(-4px);
                }

                .venue-card-grid .venue-image {
                    height: 100px;
                    border-radius: 12px 12px 0 0;
                }

                .venue-card-grid .venue-info {
                    padding: 12px;
                }

                .promo-banner {
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 28px;
                }

                .promo-banner.pink {
                    background: linear-gradient(135deg, #ffb6c1, #ffc0cb);
                }

                .promo-banner.dark {
                    background: #1a1a1a;
                    border: 1px solid #333;
                }

                .promo-content {
                    color: #333;
                }

                .promo-content.centered {
                    text-align: center;
                    color: white;
                }

                .promo-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin: 0;
                }

                .promo-subtitle {
                    font-size: 18px;
                    margin: 4px 0 0 0;
                }

                .mastercard-logo {
                    font-size: 24px;
                    color: #ff6b00;
                }

                .highlight-red {
                    color: #ff4444;
                    margin: 0 4px;
                }

                .highlight-yellow {
                    color: #ffcc00;
                    margin: 0 4px;
                }

                .events-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .event-card {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    background: #111;
                    border-radius: 12px;
                    padding: 12px;
                }

                .event-card .event-image {
                    position: relative;
                    width: 80px;
                    height: 80px;
                    border-radius: 10px;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .event-card .event-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .event-info {
                    flex: 1;
                }

                .event-info h3 {
                    font-size: 14px;
                    font-weight: 600;
                    color: white;
                    margin: 0 0 4px 0;
                }

                .event-venue {
                    font-size: 12px;
                    color: #888;
                    margin: 0 0 4px 0;
                }

                .event-date {
                    font-size: 11px;
                    color: #666;
                    margin: 0;
                }

                .event-price {
                    font-size: 16px;
                    font-weight: 600;
                    color: white;
                }

                .no-events {
                    color: #666;
                    text-align: center;
                    padding: 20px;
                }

                .clubs-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .club-card {
                    background: #1a1a1a;
                    border-radius: 16px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s;
                    border: 1px solid #333;
                }

                .club-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 8px 24px rgba(255, 107, 157, 0.2);
                    border-color: #ff6b9d;
                }

                .club-image {
                    width: 100%;
                    height: 200px;
                    position: relative;
                    overflow: hidden;
                    background: #0a0a0a;
                }

                .club-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .club-info {
                    padding: 16px;
                }

                .club-info h3 {
                    color: white;
                    font-size: 18px;
                    font-weight: 600;
                    margin: 0 0 8px 0;
                }

                .club-location {
                    color: #888;
                    font-size: 14px;
                    margin: 0 0 12px 0;
                }

                /* Mobile Small (320px - 480px) */
                @media (max-width: 480px) {
                    .browse-container {
                        padding: 16px;
                    }

                    .profile-avatar {
                        width: 40px;
                        height: 40px;
                    }

                    .user-name {
                        font-size: 16px;
                    }

                    .section-title {
                        font-size: 14px;
                    }

                    .venue-card {
                        min-width: 140px;
                    }

                    .venue-image {
                        height: 85px;
                    }

                    .promo-banner {
                        padding: 16px;
                    }

                    .promo-title, .promo-subtitle {
                        font-size: 16px;
                    }

                    .event-card .event-image {
                        width: 70px;
                        height: 70px;
                    }
                }

                /* Tablet (481px - 768px) */
                @media (min-width: 481px) and (max-width: 768px) {
                    .browse-container {
                        padding: 20px 24px;
                    }

                    .grid-2col {
                        gap: 16px;
                    }

                    .venue-card {
                        min-width: 180px;
                    }

                    .venue-image {
                        height: 110px;
                    }

                    .venue-card-grid .venue-image {
                        height: 120px;
                    }
                }

                /* Desktop (769px+) */
                @media (min-width: 769px) {
                    .browse-container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 32px 40px;
                    }

                    .header {
                        margin-bottom: 28px;
                    }

                    .profile-avatar {
                        width: 56px;
                        height: 56px;
                    }

                    .user-name {
                        font-size: 22px;
                    }

                    .greeting {
                        font-size: 14px;
                    }

                    .search-bar {
                        padding: 16px 20px;
                        font-size: 16px;
                    }

                    .filter-chip {
                        padding: 10px 20px;
                        font-size: 14px;
                    }

                    .section-title {
                        font-size: 18px;
                        margin-bottom: 20px;
                    }

                    .venue-card {
                        min-width: 200px;
                    }

                    .venue-image {
                        height: 130px;
                    }

                    .venue-info h3 {
                        font-size: 16px;
                    }

                    .venue-info p {
                        font-size: 13px;
                    }

                    .grid-2col {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 20px;
                    }

                    .venue-card-grid .venue-image {
                        height: 140px;
                    }

                    .promo-banner {
                        padding: 32px;
                        border-radius: 20px;
                    }

                    .promo-title {
                        font-size: 22px;
                    }

                    .promo-subtitle {
                        font-size: 22px;
                    }

                    .event-card {
                        padding: 16px;
                    }

                    .event-card .event-image {
                        width: 100px;
                        height: 100px;
                    }

                    .event-info h3 {
                        font-size: 16px;
                    }

                    .event-price {
                        font-size: 18px;
                    }
                }

                /* Large Desktop (1200px+) */
                @media (min-width: 1200px) {
                    .browse-container {
                        max-width: 1000px;
                        padding: 40px 60px;
                    }

                    .grid-2col {
                        grid-template-columns: repeat(4, 1fr);
                    }

                    .venue-card {
                        min-width: 220px;
                    }

                    .venue-image {
                        height: 150px;
                    }
                }
            `}</style>
        </div>
    );
}
