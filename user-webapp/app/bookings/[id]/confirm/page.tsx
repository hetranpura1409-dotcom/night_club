'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { confirmBooking, getBookingById } from '../../../../../services/api';

export default function BookingConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params?.id as string;

    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        handleConfirmation();
    }, [bookingId]);

    const handleConfirmation = async () => {
        try {
            // Confirm the booking
            await confirmBooking(bookingId);

            // Fetch booking details
            const bookingData = await getBookingById(bookingId);
            setBooking(bookingData);
        } catch (err: any) {
            console.error('Confirmation failed:', err);
            setError(err.response?.data?.message || 'Failed to confirm booking');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Confirming your booking...</p>
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
            width: 50px;
            height: 50px;
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

    if (error || !booking) {
        return (
            <div className="error-page">
                <div className="error-icon">⚠️</div>
                <h1>Booking Failed</h1>
                <p>{error || 'Something went wrong'}</p>
                <button onClick={() => router.push('/browse')} className="btn-secondary">
                    Back to Browse
                </button>
                <style jsx>{`
          .error-page {
            min-height: 100vh;
            background: #000;
            color: white;
            padding: 40px 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .error-icon {
            font-size: 64px;
            margin-bottom: 16px;
          }
          h1 {
            font-size: 28px;
            margin-bottom: 12px;
          }
          p {
            color: #888;
            margin-bottom: 32px;
          }
          .btn-secondary {
            padding: 12px 32px;
            background: transparent;
            border: 1px solid #666;
            color: white;
            border-radius: 24px;
            cursor: pointer;
            font-size: 15px;
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className="confirmation-page">
            <div className="success-animation">
                <div className="success-icon">✓</div>
            </div>

            <h1>Booking Confirmed!</h1>
            <p className="subtitle">Your table has been successfully reserved</p>

            <div className="booking-card">
                <h2>{booking.nightclub?.name || 'Venue'}</h2>

                <div className="details-grid">
                    <div className="detail-item">
                        <span className="label">📅 Date</span>
                        <span className="value">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                    </div>

                    <div className="detail-item">
                        <span className="label">🕐 Time</span>
                        <span className="value">{booking.bookingTime}</span>
                    </div>

                    <div className="detail-item">
                        <span className="label">👥 Guests</span>
                        <span className="value">{booking.numberOfGuests}</span>
                    </div>

                    <div className="detail-item">
                        <span className="label">🪑 Table</span>
                        <span className="value">{booking.table?.capacity || 'N/A'} pax</span>
                    </div>
                </div>

                {booking.specialRequests && (
                    <div className="special-requests">
                        <p className="label">Special Requests:</p>
                        <p className="value">{booking.specialRequests}</p>
                    </div>
                )}

                <div className="total-paid">
                    <span>Total Paid</span>
                    <span className="amount">€{Number(booking.totalAmount).toFixed(2)}</span>
                </div>

                <div className="booking-id">
                    Booking ID: {booking.id?.slice(0, 8)}...
                </div>
            </div>

            <div className="actions">
                <button onClick={() => router.push('/bookings')} className="btn-primary">
                    View My Bookings
                </button>
                <button onClick={() => router.push('/browse')} className="btn-secondary">
                    Browse More Venues
                </button>
            </div>

            <style jsx>{`
        .confirmation-page {
          min-height: 100vh;
          background: #000;
          color: white;
          padding: 40px 20px;
        }

        .success-animation {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: #00ff88;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 700;
          color: #000;
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        h1 {
          text-align: center;
          font-size: 32px;
          margin-bottom: 8px;
        }

        .subtitle {
          text-align: center;
          font-size: 16px;
          color: #888;
          margin-bottom: 40px;
        }

        .booking-card {
          background: #1a1a1a;
          border-radius: 16px;
          padding: 32px;
          max-width: 600px;
          margin: 0 auto 32px;
          border: 1px solid #333;
        }

        .booking-card h2 {
          font-size: 24px;
          margin-bottom: 24px;
          text-align: center;
          color: #00ff88;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .label {
          color: #888;
          font-size: 14px;
        }

        .value {
          font-weight: 600;
          font-size: 16px;
        }

        .special-requests {
          background: #0a0a0a;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .special-requests .label {
          margin-bottom: 8px;
        }

        .special-requests .value {
          color: #ccc;
        }

        .total-paid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 24px;
          border-top: 2px solid #00ff88;
          font-size: 18px;
          font-weight: 700;
        }

        .amount {
          color: #00ff88;
          font-size: 28px;
        }

        .booking-id {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 16px;
          font-family: monospace;
        }

        .actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          max-width: 600px;
          margin: 0 auto;
        }

        .btn-primary, .btn-secondary {
          flex: 1;
          padding: 14px 24px;
          border-radius: 24px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #00ff88, #00cc6a);
          color: #000;
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid #666;
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 255, 136, 0.3);
        }

        .btn-secondary:hover {
          border-color: white;
        }

        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr;
          }

          .actions {
            flex-direction: column;
          }
        }
      `}</style>
        </div>
    );
}
