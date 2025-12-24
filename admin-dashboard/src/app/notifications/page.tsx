'use client';

import { useState, useEffect } from 'react';
import { getUsers, sendNotification } from '../../services/api';

export default function NotificationsPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [type, setType] = useState('system');
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to load users', error);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId || !title || !message) {
            setResult({ type: 'error', message: 'Please fill all fields' });
            return;
        }

        setSending(true);
        setResult(null);

        try {
            await sendNotification({
                userId: selectedUserId,
                title,
                message,
                type,
            });

            setResult({
                type: 'success',
                message: `Notification "${title}" sent successfully!`
            });

            // Reset form
            setTitle('');
            setMessage('');
            setSelectedUserId('');
        } catch (error) {
            setResult({ type: 'error', message: 'Failed to send notification' });
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1a1d29' }}>
                Send Push Notification
            </h1>

            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <form onSubmit={handleSend} style={{ maxWidth: '600px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Select User
                        </label>
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                            }}
                        >
                            <option value="">-- Choose a user --</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.mobile})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Notification Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                            }}
                        >
                            <option value="system">⚙️ System</option>
                            <option value="booking">🎫 Booking</option>
                            <option value="event">🎉 Event</option>
                            <option value="promotion">💎 Promotion</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Notification Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Special Event Tonight!"
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter your notification message here..."
                            required
                            rows={4}
                            style={{
                                width: '100%',
                                padding: '10px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={sending}
                        style={{
                            backgroundColor: sending ? '#9CA3AF' : '#7C3AED',
                            color: 'white',
                            padding: '12px 24px',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: sending ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {sending ? 'Sending...' : '📤 Send Notification'}
                    </button>
                </form>

                {result && (
                    <div
                        style={{
                            marginTop: '20px',
                            padding: '12px 16px',
                            borderRadius: '6px',
                            backgroundColor: result.type === 'success' ? '#f0fdf4' : '#fef2f2',
                            border: result.type === 'success' ? '1px solid #86efac' : '1px solid #fca5a5',
                            color: result.type === 'success' ? '#15803d' : '#dc2626',
                            fontSize: '14px',
                        }}
                    >
                        {result.message}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fcd34d' }}>
                <p style={{ fontSize: '14px', color: '#92400e', margin: 0, lineHeight: 1.6 }}>
                    <strong>⚠️ POC Note:</strong> Push notifications require Firebase Cloud Messaging (FCM) integration.
                    For now, this is a UI-only demo. To enable real push notifications:
                </p>
                <ul style={{ fontSize: '13px', color: '#92400e', marginTop: '8px', paddingLeft: '20px' }}>
                    <li>Set up Firebase project and get credentials</li>
                    <li>Install @google-cloud/firestore-admin in backend</li>
                    <li>Store user FCM tokens during mobile app login</li>
                    <li>Create POST /notifications/send endpoint</li>
                </ul>
            </div>
        </div>
    );
}
