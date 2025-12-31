'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './check-in.module.css';

interface BookingDetails {
    id: string;
    bookingDate: string;
    bookingTime: string;
    numberOfGuests: number;
    status: string;
    checkedIn: boolean;
    checkedInAt: string | null;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    table: {
        capacity: number;
    };
    nightclub: {
        name: string;
    };
}

interface CheckInResult {
    success: boolean;
    message: string;
    checkedInAt: string;
    booking: BookingDetails;
}

export default function CheckInPage() {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<CheckInResult | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const scannerRef = useRef<any>(null);
    const html5QrcodeRef = useRef<any>(null);

    useEffect(() => {
        return () => {
            stopScanner();
        };
    }, []);

    const startScanner = async () => {
        setError('');
        setResult(null);
        setScanning(true);

        try {
            const { Html5Qrcode } = await import('html5-qrcode');
            html5QrcodeRef.current = new Html5Qrcode('qr-reader');

            await html5QrcodeRef.current.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                async (decodedText: string) => {
                    await handleQRCodeScanned(decodedText);
                },
                () => { }
            );
        } catch (err: any) {
            console.error('Scanner error:', err);
            setError('Failed to start camera. Please check permissions or use manual entry.');
            setScanning(false);
        }
    };

    const stopScanner = async () => {
        if (html5QrcodeRef.current) {
            try {
                await html5QrcodeRef.current.stop();
                html5QrcodeRef.current = null;
            } catch (err) {
                console.log('Scanner already stopped');
            }
        }
        setScanning(false);
    };

    const handleQRCodeScanned = async (qrData: string) => {
        await stopScanner();
        setLoading(true);

        try {
            // Parse QR data
            const data = JSON.parse(qrData);
            const qrCode = data.qrCode;

            // Verify and check-in
            await verifyAndCheckIn(qrCode);
        } catch (err: any) {
            setError('Invalid QR code format');
        } finally {
            setLoading(false);
        }
    };

    const verifyAndCheckIn = async (qrCode: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
            const response = await fetch(`${apiUrl}/bookings/verify-checkin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qrCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Check-in failed');
            }

            setResult(data);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Failed to verify ticket');
            setResult(null);
        }
    };

    const handleManualEntry = async () => {
        if (!manualCode.trim()) {
            setError('Please enter a booking code');
            return;
        }
        setLoading(true);
        await verifyAndCheckIn(manualCode.trim());
        setLoading(false);
    };

    const resetScanner = () => {
        setResult(null);
        setError('');
        setManualCode('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>🎫 Guest Check-In</h1>
                <p>Scan QR code or enter booking code manually</p>
            </div>

            {loading && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Verifying ticket...</p>
                </div>
            )}

            {!loading && !result && (
                <>
                    {/* QR Scanner */}
                    <div className={styles.scannerSection}>
                        <div id="qr-reader" ref={scannerRef} className={styles.scanner}></div>

                        {!scanning ? (
                            <button onClick={startScanner} className={styles.scanButton}>
                                📷 Start Camera Scanner
                            </button>
                        ) : (
                            <button onClick={stopScanner} className={styles.stopButton}>
                                ⏹️ Stop Scanner
                            </button>
                        )}
                    </div>

                    <div className={styles.divider}>
                        <span>OR</span>
                    </div>

                    {/* Manual Entry */}
                    <div className={styles.manualSection}>
                        <h3>Manual Entry</h3>
                        <input
                            type="text"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                            placeholder="Enter QR code..."
                            className={styles.input}
                        />
                        <button onClick={handleManualEntry} className={styles.verifyButton}>
                            ✓ Verify & Check-In
                        </button>
                    </div>
                </>
            )}

            {error && (
                <div className={styles.errorCard}>
                    <div className={styles.errorIcon}>❌</div>
                    <h2>Check-In Failed</h2>
                    <p>{error}</p>
                    <button onClick={resetScanner} className={styles.retryButton}>
                        Try Again
                    </button>
                </div>
            )}

            {result && (
                <div className={result.success ? styles.successCard : styles.warningCard}>
                    <div className={styles.resultIcon}>
                        {result.success ? '✅' : '⚠️'}
                    </div>
                    <h2>{result.message}</h2>

                    <div className={styles.bookingDetails}>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Guest:</span>
                            <span className={styles.value}>
                                {result.booking.user.firstName} {result.booking.user.lastName}
                            </span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Date:</span>
                            <span className={styles.value}>
                                {new Date(result.booking.bookingDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Time:</span>
                            <span className={styles.value}>{result.booking.bookingTime}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Guests:</span>
                            <span className={styles.value}>{result.booking.numberOfGuests}</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Table:</span>
                            <span className={styles.value}>{result.booking.table.capacity} pax</span>
                        </div>
                        <div className={styles.detailRow}>
                            <span className={styles.label}>Checked In:</span>
                            <span className={styles.value}>
                                {new Date(result.checkedInAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>

                    <button onClick={resetScanner} className={styles.nextButton}>
                        Scan Next Guest
                    </button>
                </div>
            )}
        </div>
    );
}
