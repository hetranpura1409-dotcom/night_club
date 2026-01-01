'use client';

import { useEffect, useState } from 'react';
import styles from './bookings.module.css';

interface Booking {
    id: string;
    bookingDate: string;
    bookingTime: string;
    numberOfGuests: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    qrCode: string | null;
    checkedIn: boolean;
    checkedInAt: string | null;
    createdAt: string;
    user?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    nightclub?: {
        name: string;
    };
    table?: {
        name: string;
        capacity: number;
    };
}

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedQR, setSelectedQR] = useState<string | null>(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
            const response = await fetch(`${apiUrl}/bookings/admin/all`);
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            const data = await response.json();
            setBookings(data);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            confirmed: styles.statusConfirmed,
            pending: styles.statusPending,
            cancelled: styles.statusCancelled,
            completed: styles.statusCompleted,
        };
        return colors[status] || styles.statusPending;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>🎫 All Bookings</h1>
                <p>View all bookings and their QR codes</p>
                <button onClick={fetchBookings} className={styles.refreshBtn}>
                    🔄 Refresh
                </button>
            </div>

            {loading && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading bookings...</p>
                </div>
            )}

            {error && (
                <div className={styles.error}>
                    <p>❌ {error}</p>
                    <button onClick={fetchBookings}>Retry</button>
                </div>
            )}

            {!loading && !error && bookings.length === 0 && (
                <div className={styles.empty}>
                    <p>📭 No bookings yet</p>
                </div>
            )}

            {!loading && !error && bookings.length > 0 && (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Guest</th>
                                <th>Venue</th>
                                <th>Date & Time</th>
                                <th>Guests</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Check-In</th>
                                <th>QR Code</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>
                                        <div className={styles.guestInfo}>
                                            <strong>
                                                {booking.user?.firstName} {booking.user?.lastName}
                                            </strong>
                                            <span className={styles.email}>{booking.user?.email}</span>
                                        </div>
                                    </td>
                                    <td>{booking.nightclub?.name || 'N/A'}</td>
                                    <td>
                                        <div>{formatDate(booking.bookingDate)}</div>
                                        <span className={styles.time}>{booking.bookingTime}</span>
                                    </td>
                                    <td>{booking.numberOfGuests}</td>
                                    <td className={styles.amount}>€{Number(booking.totalAmount).toFixed(2)}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${getStatusBadge(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        {booking.checkedIn ? (
                                            <span className={styles.checkedIn}>✅ Checked In</span>
                                        ) : (
                                            <span className={styles.notCheckedIn}>⏳ Not yet</span>
                                        )}
                                    </td>
                                    <td>
                                        {booking.qrCode ? (
                                            <button
                                                onClick={() => setSelectedQR(booking.qrCode)}
                                                className={styles.qrBtn}
                                            >
                                                👁️ View QR
                                            </button>
                                        ) : (
                                            <span className={styles.noQR}>No QR</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* QR Code Modal */}
            {selectedQR && (
                <div className={styles.modal} onClick={() => setSelectedQR(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>🎫 QR Code</h3>
                        <div className={styles.qrCodeBox}>
                            <code className={styles.qrCodeText}>{selectedQR}</code>
                        </div>
                        <p className={styles.modalHint}>
                            Copy this code and use it in the Check-In page
                        </p>
                        <div className={styles.modalActions}>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedQR);
                                    alert('QR code copied to clipboard!');
                                }}
                                className={styles.copyBtn}
                            >
                                📋 Copy Code
                            </button>
                            <button onClick={() => setSelectedQR(null)} className={styles.closeBtn}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
