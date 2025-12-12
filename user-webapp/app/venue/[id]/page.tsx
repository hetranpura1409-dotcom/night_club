'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getNightclubs, getTablesByNightclub } from '../../../services/api';

interface Nightclub {
    id: string;
    name: string;
    description: string;
    location: string;
    imageUrl: string;
    city?: string;
    category?: string;
    rating?: number;
    priceRange?: string;
}

interface Table {
    id: string;
    name: string;
    capacity: number;
    date: string;
    time: string;
    price: number;
    available: boolean;
}

export default function VenuePage() {
    const router = useRouter();
    const params = useParams();
    const venueId = params?.id as string;

    const [venue, setVenue] = useState<Nightclub | null>(null);
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'tables' | 'tickets' | 'guestlist' | 'menu'>('tables');

    // Venue images
    const venueImages = [
        venue?.imageUrl || '',
        venue?.imageUrl || '',
        venue?.imageUrl || '',
        venue?.imageUrl || '',
    ];

    useEffect(() => {
        loadVenue();
    }, [venueId]);

    const loadVenue = async () => {
        try {
            setLoading(true);
            const clubs = await getNightclubs();
            const found = clubs.find((c: Nightclub) => c.id === venueId);
            setVenue(found || null);

            // Fetch tables for this venue
            if (venueId) {
                try {
                    const venueTables = await getTablesByNightclub(venueId);
                    setTables(venueTables);
                } catch (err) {
                    console.error('Failed to load tables:', err);
                    setTables([]);
                }
            }
        } catch (error) {
            console.error('Failed to load venue:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <style jsx>{`
                    .loading-container {
                        min-height: 100vh;
                        background: #000000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
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

    if (!venue) {
        return (
            <div className="error-container">
                <h2>Venue not found</h2>
                <button onClick={() => router.push('/browse')}>Back to Browse</button>
                <style jsx>{`
                    .error-container {
                        min-height: 100vh;
                        background: #000000;
                        color: white;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 20px;
                    }
                    button {
                        padding: 12px 24px;
                        background: white;
                        color: black;
                        border: none;
                        border-radius: 24px;
                        cursor: pointer;
                        font-weight: 600;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="venue-page">
            {/* Image Gallery */}
            <div className="image-gallery">
                <button className="back-btn" onClick={() => router.back()}>
                    ← Back
                </button>
                <div className="gallery-grid">
                    {venueImages.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="gallery-item">
                            {img ? (
                                <img src={img} alt={`${venue.name} ${idx + 1}`} />
                            ) : (
                                <div className="placeholder">🎵</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Venue Info */}
            <div className="venue-content">
                <div className="venue-header">
                    <div className="header-left">
                        <h1>{venue.name}</h1>
                        <div className="rating-row">
                            <div className="stars">
                                {'★'.repeat(Math.floor(venue.rating || 5))}
                                {'☆'.repeat(5 - Math.floor(venue.rating || 5))}
                            </div>
                            <span className="rating-count">• {venue.rating || '5.0'}</span>
                        </div>
                    </div>
                    <button className="favorite-btn">♡</button>
                </div>

                <div className="venue-meta">
                    <div className="meta-item">
                        <span className="icon">📍</span>
                        <span>{venue.location}</span>
                    </div>
                    <div className="meta-item">
                        <span className="icon">🕒</span>
                        <span>Opens at 22:00 • Closes at 03:00</span>
                    </div>
                </div>

                <p className="description">{venue.description}</p>

                <div className="action-buttons">
                    <button className="btn-primary">Reserve a guest</button>
                    <button className="btn-secondary">
                        <span>📷</span> Instagram
                    </button>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'tables' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tables')}
                    >
                        Tables
                    </button>
                    <button
                        className={`tab ${activeTab === 'tickets' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tickets')}
                    >
                        Tickets
                    </button>
                    <button
                        className={`tab ${activeTab === 'guestlist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('guestlist')}
                    >
                        Guest List
                    </button>
                    <button
                        className={`tab ${activeTab === 'menu' ? 'active' : ''}`}
                        onClick={() => setActiveTab('menu')}
                    >
                        Menu
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'tables' && (
                    <div className="tab-content">
                        {/* Floor Plan */}
                        <div className="floor-plan">
                            <h3>Floor Plan</h3>
                            <div className="floor-plan-image">
                                <div className="plan-placeholder">
                                    <svg width="100%" height="200" viewBox="0 0 300 200">
                                        <rect x="50" y="50" width="200" height="100" fill="none" stroke="#666" strokeWidth="2" />
                                        <text x="150" y="105" fill="#666" textAnchor="middle" fontSize="14">Floor Plan</text>
                                        <circle cx="80" cy="80" r="5" fill="#ff6b9d" />
                                        <circle cx="220" cy="80" r="5" fill="#ff6b9d" />
                                        <circle cx="80" cy="120" r="5" fill="#ff6b9d" />
                                        <circle cx="220" cy="120" r="5" fill="#ff6b9d" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Tables List */}
                        <div className="tables-section">
                            <h3>Tables</h3>
                            {tables.length > 0 ? (
                                <div className="tables-list">
                                    {tables.map((table) => (
                                        <div key={table.id} className="table-item">
                                            <div className="table-icon">👥</div>
                                            <div className="table-info">
                                                <div className="table-name">{table.capacity} pax {table.name ? `- ${table.name}` : ''}</div>
                                                <div className="table-details">
                                                    <span>{table.date}</span>
                                                    <span className="dot">•</span>
                                                    <span>{table.time}</span>
                                                </div>
                                            </div>
                                            <div className="table-price">
                                                <div className="price-amount">€{Number(table.price).toLocaleString()}</div>
                                                <button className="select-btn">Select</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <p>No tables available at the moment</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'tickets' && (
                    <div className="tab-content">
                        <div className="empty-state">
                            <p>🎫 No tickets available at the moment</p>
                        </div>
                    </div>
                )}

                {activeTab === 'guestlist' && (
                    <div className="tab-content">
                        <div className="empty-state">
                            <p>📋 Guestlist coming soon</p>
                        </div>
                    </div>
                )}

                {activeTab === 'menu' && (
                    <div className="tab-content">
                        <div className="menu-section">
                            <h3>🍹 Drinks</h3>
                            <div className="menu-items">
                                <div className="menu-item">
                                    <div className="menu-item-info">
                                        <div className="menu-item-name">Vodka Bottle</div>
                                        <div className="menu-item-desc">Premium vodka selection</div>
                                    </div>
                                    <div className="menu-item-price">€250</div>
                                </div>
                                <div className="menu-item">
                                    <div className="menu-item-info">
                                        <div className="menu-item-name">Champagne</div>
                                        <div className="menu-item-desc">Moët & Chandon</div>
                                    </div>
                                    <div className="menu-item-price">€350</div>
                                </div>
                                <div className="menu-item">
                                    <div className="menu-item-info">
                                        <div className="menu-item-name">Whiskey Bottle</div>
                                        <div className="menu-item-desc">Jack Daniel's, Johnnie Walker</div>
                                    </div>
                                    <div className="menu-item-price">€300</div>
                                </div>
                            </div>

                            <h3 style={{ marginTop: '32px' }}>🍔 Food</h3>
                            <div className="menu-items">
                                <div className="menu-item">
                                    <div className="menu-item-info">
                                        <div className="menu-item-name">VIP Platter</div>
                                        <div className="menu-item-desc">Assorted snacks and appetizers</div>
                                    </div>
                                    <div className="menu-item-price">€80</div>
                                </div>
                                <div className="menu-item">
                                    <div className="menu-item-info">
                                        <div className="menu-item-name">Cheese Board</div>
                                        <div className="menu-item-desc">Selection of premium cheeses</div>
                                    </div>
                                    <div className="menu-item-price">€60</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .venue-page {
                    min-height: 100vh;
                    background: #000;
                    color: white;
                }

                .image-gallery {
                    position: relative;
                    width: 100%;
                    padding: 16px;
                }

                .back-btn {
                    position: absolute;
                    top: 24px;
                    left: 24px;
                    z-index: 10;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                }

                .gallery-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .gallery-item {
                    aspect-ratio: 1;
                    border-radius: 12px;
                    overflow: hidden;
                    background: #1a1a1a;
                }

                .gallery-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                    background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
                }

                .venue-content {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 24px;
                }

                .venue-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 16px;
                }

                h1 {
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0 0 8px 0;
                }

                .rating-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .stars {
                    color: #ffd700;
                    font-size: 16px;
                }

                .rating-count {
                    color: #888;
                    font-size: 14px;
                }

                .favorite-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .favorite-btn:hover {
                    background: rgba(255, 107, 157, 0.3);
                    transform: scale(1.1);
                }

                .venue-meta {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 16px;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #ccc;
                }

                .icon {
                    font-size: 16px;
                }

                .description {
                    color: #aaa;
                    line-height: 1.6;
                    margin-bottom: 24px;
                    font-size: 14px;
                }

                .action-buttons {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 32px;
                }

                .btn-primary, .btn-secondary {
                    flex: 1;
                    padding: 14px 20px;
                    border: none;
                    border-radius: 24px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .btn-primary {
                    background: #00ff88;
                    color: #000;
                }

                .btn-primary:hover {
                    background: #00cc6f;
                    transform: translateY(-2px);
                }

                .btn-secondary {
                    background: transparent;
                    border: 1px solid #666;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                .btn-secondary:hover {
                    border-color: white;
                }

                .tabs {
                    display: flex;
                    border-bottom: 1px solid #333;
                    margin-bottom: 24px;
                }

                .tab {
                    flex: 1;
                    padding: 12px;
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    position: relative;
                    transition: color 0.3s;
                }

                .tab:hover {
                    color: #aaa;
                }

                .tab.active {
                    color: white;
                }

                .tab.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #00ff88;
                }

                .tab-content {
                    margin-top: 24px;
                }

                .floor-plan {
                    margin-bottom: 32px;
                }

                .floor-plan h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 0 16px 0;
                }

                .floor-plan-image {
                    background: #0a0a0a;
                    border-radius: 12px;
                    padding: 20px;
                    border: 1px solid #222;
                }

                .tables-section h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 0 16px 0;
                }

                .tables-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .table-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    padding: 16px;
                    transition: all 0.3s;
                }

                .table-item:hover {
                    border-color: #444;
                    transform: translateY(-2px);
                }

                .table-icon {
                    font-size: 24px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #1a1a1a;
                    border-radius: 8px;
                }

                .table-info {
                    flex: 1;
                }

                .table-name {
                    font-size: 15px;
                    font-weight: 600;
                    margin-bottom: 4px;
                }

                .table-details {
                    font-size: 13px;
                    color: #888;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .dot {
                    font-size: 10px;
                }

                .table-price {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .price-amount {
                    font-size: 16px;
                    font-weight: 700;
                }

                .select-btn {
                    background: transparent;
                    border: 1px solid #00ff88;
                    color: #00ff88;
                    padding: 6px 16px;
                    border-radius: 16px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .select-btn:hover {
                    background: #00ff88;
                    color: #000;
                }

                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: #666;
                }

                .menu-section h3 {
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0 0 16px 0;
                }

                .menu-items {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .menu-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px;
                    background: #111;
                    border: 1px solid #222;
                    border-radius: 12px;
                    transition: all 0.3s;
                }

                .menu-item:hover {
                    border-color: #444;
                    transform: translateY(-2px);
                }

                .menu-item-info {
                    flex: 1;
                }

                .menu-item-name {
                    font-size: 15px;
                    font-weight: 600;
                    margin-bottom: 4px;
                    color: white;
                }

                .menu-item-desc {
                    font-size: 13px;
                    color: #888;
                }

                .menu-item-price {
                    font-size: 16px;
                    font-weight: 700;
                    color: #00ff88;
                }

                @media (min-width: 768px) {
                    .image-gallery {
                        padding: 24px;
                    }

                    .gallery-grid {
                        grid-template-columns: repeat(4, 1fr);
                        gap: 12px;
                    }

                    .venue-content {
                        padding: 32px 40px;
                    }

                    h1 {
                        font-size: 32px;
                    }

                    .action-buttons {
                        max-width: 400px;
                    }
                }
            `}</style>
        </div>
    );
}
