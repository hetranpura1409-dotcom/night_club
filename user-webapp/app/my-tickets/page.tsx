'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserBookings, getBookingQRCode } from '../../services/api';

interface Booking {
    id: string;
    bookingDate: string;
    bookingTime: string;
    numberOfGuests: number;
    totalAmount: number;
    status: string;
    qrCode: string | null;
    checkedIn: boolean;
    nightclub?: {
        name: string;
    };
    table?: {
        name: string;
        capacity: number;
    };
}

export default function MyBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [qrCodeImage, setQrCodeImage] = useState<string>('');
    const [loadingQR, setLoadingQR] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getUserBookings();
            setBookings(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const viewQRCode = async (booking: Booking) => {
        setSelectedBooking(booking);
        setLoadingQR(true);
        try {
            const qrCode = await getBookingQRCode(booking.id);
            setQrCodeImage(qrCode);
        } catch (err) {
            console.error('Failed to load QR code');
        } finally {
            setLoadingQR(false);
        }
    };

    const closeModal = () => {
        setSelectedBooking(null);
        setQrCodeImage('');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return '#00ff88';
            case 'pending': return '#ffc107';
            case 'cancelled': return '#dc3545';
            default: return '#888';
        }
    };

    return (
        <div className="page-container">
            <header className="header">
                <button onClick={() => router.back()} className="back-btn">← Back</button>
                <h1>🎫 My Tickets</h1>
            </header>

            {loading && (
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Loading your bookings...</p>
                </div>
            )}

            {error && (
                <div className="error">
                    <p>❌ {error}</p>
                    <button onClick={fetchBookings}>Retry</button>
                </div>
            )}

            {!loading && !error && bookings.length === 0 && (
                <div className="empty">
                    <p>📭 No bookings yet</p>
                    <p className="hint">Your bookings will appear here after you make a reservation</p>
                    <button onClick={() => router.push('/browse')} className="browse-btn">
                        Browse Venues
                    </button>
                </div>
            )}

            {!loading && !error && bookings.length > 0 && (
                <div className="bookings-list">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-header">
                                <h3>{booking.nightclub?.name || 'Venue'}</h3>
                                <span
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusColor(booking.status) }}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            <div className="booking-details">
                                <div className="detail">
                                    <span className="label">📅 Date</span>
                                    <span className="value">{formatDate(booking.bookingDate)}</span>
                                </div>
                                <div className="detail">
                                    <span className="label">🕐 Time</span>
                                    <span className="value">{booking.bookingTime}</span>
                                </div>
                                <div className="detail">
                                    <span className="label">👥 Guests</span>
                                    <span className="value">{booking.numberOfGuests}</span>
                                </div>
                                <div className="detail">
                                    <span className="label">💰 Total</span>
                                    <span className="value">€{Number(booking.totalAmount).toFixed(2)}</span>
                                </div>
                            </div>

                            {booking.checkedIn && (
                                <div className="checked-in-badge">
                                    ✅ Checked In
                                </div>
                            )}

                            {booking.status === 'confirmed' && !booking.checkedIn && (
                                <button
                                    onClick={() => viewQRCode(booking)}
                                    className="view-ticket-btn"
                                >
                                    🎫 View Ticket
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* QR Code Modal */}
            {selectedBooking && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>🎫 Your Ticket</h2>
                        <p className="venue-name">{selectedBooking.nightclub?.name}</p>

                        <div className="ticket-info">
                            <p>{formatDate(selectedBooking.bookingDate)} at {selectedBooking.bookingTime}</p>
                            <p>{selectedBooking.numberOfGuests} guests</p>
                        </div>

                        {loadingQR ? (
                            <div className="qr-loading">
                                <div className="spinner"></div>
                                <p>Loading QR code...</p>
                            </div>
                        ) : qrCodeImage ? (
                            <div className="qr-code-container">
                                <img src={qrCodeImage} alt="Entry QR Code" className="qr-code-image" />
                                <p className="qr-hint">Show this at the door for entry</p>
                            </div>
                        ) : (
                            <div className="qr-error">
                                <p>Failed to load QR code</p>
                            </div>
                        )}

                        <button onClick={closeModal} className="close-btn">Close</button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .page-container {
                    min-height: 100vh;
                    background: #000;
                    color: white;
                    padding: 20px;
                }

                .header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .back-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                }

                h1 {
                    font-size: 24px;
                    margin: 0;
                }

                .loading, .error, .empty {
                    text-align: center;
                    padding: 64px 20px;
                    color: #888;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #333;
                    border-top-color: #00ff88;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 16px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .hint {
                    font-size: 14px;
                    margin-top: 8px;
                }

                .browse-btn {
                    margin-top: 24px;
                    padding: 14px 32px;
                    background: #00ff88;
                    color: #000;
                    border: none;
                    border-radius: 24px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .bookings-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .booking-card {
                    background: #111;
                    border-radius: 16px;
                    padding: 20px;
                    border: 1px solid #222;
                }

                .booking-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .booking-header h3 {
                    margin: 0;
                    font-size: 18px;
                }

                .status-badge {
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: capitalize;
                    color: #000;
                }

                .booking-details {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .detail {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .label {
                    font-size: 12px;
                    color: #666;
                }

                .value {
                    font-size: 14px;
                    font-weight: 500;
                }

                .checked-in-badge {
                    background: rgba(0, 255, 136, 0.1);
                    color: #00ff88;
                    padding: 12px;
                    border-radius: 12px;
                    text-align: center;
                    font-weight: 600;
                }

                .view-ticket-btn {
                    width: 100%;
                    padding: 14px;
                    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }

                .modal-content {
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 24px;
                    padding: 32px;
                    max-width: 400px;
                    width: 100%;
                    text-align: center;
                }

                .modal-content h2 {
                    margin: 0 0 8px;
                    font-size: 28px;
                }

                .venue-name {
                    color: #00ff88;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                .ticket-info {
                    color: #888;
                    margin-bottom: 24px;
                }

                .ticket-info p {
                    margin: 4px 0;
                }

                .qr-loading {
                    padding: 40px;
                }

                .qr-code-container {
                    margin-bottom: 24px;
                }

                .qr-code-image {
                    width: 200px;
                    height: 200px;
                    padding: 12px;
                    background: white;
                    border-radius: 12px;
                }

                .qr-hint {
                    color: #666;
                    font-size: 14px;
                    margin-top: 12px;
                }

                .close-btn {
                    padding: 14px 48px;
                    background: #333;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
}
