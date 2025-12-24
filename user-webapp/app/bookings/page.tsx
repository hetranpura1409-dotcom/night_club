'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserBookings, cancelBooking } from '../../services/api';

export default function MyBookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState<string | null>(null);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await getUserBookings();
            setBookings(data);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking? You will receive a full refund.')) {
            return;
        }

        try {
            setCancelling(bookingId);
            await cancelBooking(bookingId);
            await loadBookings(); // Reload bookings
        } catch (error) {
            console.error('Failed to cancel booking:', error);
            alert('Failed to cancel booking. Please try again.');
        } finally {
            setCancelling(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return '#00ff88';
            case 'cancelled': return '#ff4444';
            case 'pending': return '#ffaa00';
            case 'completed': return '#888';
            default: return '#666';
        }
    };

    const getStatusLabel = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading your bookings...</p>
                <style jsx>{`
          .loading-container {
            min-height: 100vh;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
          }
          .spinner {
            border: 3px solid #333;
            border-top: 3px solid #00ff88;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className="bookings-page">
            {/* Header */}
            <div className="header">
                <button onClick={() => router.push('/browse')} className="back-button">
                    ← Back to Browse
                </button>
                <h1>My Bookings</h1>
                <p className="subtitle">{bookings.length} total bookings</p>
            </div>

            <div className="content">
                {bookings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <h2>No bookings yet</h2>
                        <p>Start exploring venues and book your first table!</p>
                        <button onClick={() => router.push('/browse')} className="btn-primary">
                            Browse Venues
                        </button>
                    </div>
                ) : (
                    <div className="bookings-grid">
                        {bookings.map((booking) => (
                            <div key={booking.id} className="booking-card">
                                <div className="booking-header">
                                    <h3>{booking.nightclub?.name || 'Venue'}</h3>
                                    <span
                                        className="status-badge"
                                        style={{ background: getStatusColor(booking.status) }}
                                    >
                                        {getStatusLabel(booking.status)}
                                    </span>
                                </div>

                                <div className="booking-details">
                                    <div className="detail-row">
                                        <span className="icon">📅</span>
                                        <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="icon">🕐</span>
                                        <span>{booking.bookingTime}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="icon">👥</span>
                                        <span>{booking.numberOfGuests} guests</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="icon">🪑</span>
                                        <span>{booking.table?.capacity || 'N/A'} pax table</span>
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    <div className="price">
                                        <span className="price-label">Total Paid:</span>
                                        <span className="price-amount">€{Number(booking.totalAmount).toFixed(2)}</span>
                                    </div>

                                    {booking.status === 'confirmed' && (
                                        <button
                                            onClick={() => handleCancel(booking.id)}
                                            disabled={cancelling === booking.id}
                                            className="btn-cancel"
                                        >
                                            {cancelling === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                                        </button>
                                    )}

                                    {booking.status === 'cancelled' && (
                                        <span className="cancelled-note">Refunded</span>
                                    )}
                                </div>

                                <div className="booking-id">
                                    ID: {booking.id?.slice(0, 12)}...
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
        .bookings-page {
          min-height: 100vh;
          background: #000;
          color: white;
          padding-bottom: 40px;
        }

        .header {
          background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
          padding: 24px;
          border-bottom: 1px solid #333;
        }

        .back-button {
          background: transparent;
          border: 1px solid #666;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 14px;
          margin-bottom: 16px;
          transition: all 0.3s;
        }

        .back-button:hover {
          border-color: #00ff88;
        }

        h1 {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .subtitle {
          color: #888;
          font-size: 14px;
        }

        .content {
          max-width: 1200px;
          margin: 32px auto;
          padding: 0 24px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: 24px;
        }

        .empty-state h2 {
          font-size: 24px;
          margin-bottom: 12px;
        }

        .empty-state p {
          color: #888;
          margin-bottom: 32px;
        }

        .btn-primary {
          padding: 14px 32px;
          background: linear-gradient(135deg, #00ff88, #00cc6a);
          color: #000;
          border: none;
          border-radius: 24px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .booking-card {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 24px;
          transition: all 0.3s;
        }

        .booking-card:hover {
          border-color: #555;
          transform: translateY(-2px);
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 20px;
        }

        .booking-header h3 {
          font-size: 20px;
          margin: 0;
          color: #00ff88;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          color: #000;
        }

        .booking-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #ccc;
          font-size: 14px;
        }

        .icon {
          font-size: 16px;
        }

        .booking-footer {
          border-top: 1px solid #333;
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .price {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .price-label {
          font-size: 12px;
          color: #888;
        }

        .price-amount {
          font-size: 20px;
          font-weight: 700;
          color: #00ff88;
        }

        .btn-cancel {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid #ff4444;
          color: #ff4444;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
        }

        .btn-cancel:hover:not(:disabled) {
          background: rgba(255, 68, 68, 0.1);
        }

        .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cancelled-note {
          font-size: 13px;
          color: #888;
          font-style: italic;
        }

        .booking-id {
          margin-top: 16px;
          color: #555;
          font-size: 11px;
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .bookings-grid {
            grid-template-columns: 1fr;
          }

          .booking-footer {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-cancel {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
}
