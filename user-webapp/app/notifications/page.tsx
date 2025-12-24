'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'booking' | 'event' | 'promotion' | 'system';
    isRead: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Get user from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            loadNotifications(parsedUser.id);
        } else {
            router.push('/');
        }
    }, []);

    const loadNotifications = async (userId: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3000/api/notifications/user/${userId}`);
            setNotifications(response.data);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'booking': return '🎫';
            case 'event': return '🎉';
            case 'promotion': return '💎';
            case 'system': return '⚙️';
            default: return '📢';
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await axios.patch(`http://localhost:3000/api/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === id ? { ...notif, isRead: true } : notif
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
            await Promise.all(unreadIds.map(id =>
                axios.patch(`http://localhost:3000/api/notifications/${id}/read`)
            ));
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, isRead: true }))
            );
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading notifications...</p>
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
        <div className="notifications-page">
            {/* Header */}
            <div className="header">
                <button className="back-btn" onClick={() => router.back()}>
                    ← Back
                </button>
                <h1>Notifications</h1>
                {unreadCount > 0 && (
                    <button className="mark-all-btn" onClick={markAllAsRead}>
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="notifications-container">
                {notifications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🔔</div>
                        <h2>No notifications yet</h2>
                        <p>We'll notify you when something important happens</p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`notification-card ${!notification.isRead ? 'unread' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <div className="notification-icon">
                                    {getIcon(notification.type)}
                                </div>
                                <div className="notification-content">
                                    <div className="notification-header">
                                        <h3>{notification.title}</h3>
                                        {!notification.isRead && <span className="unread-dot"></span>}
                                    </div>
                                    <p>{notification.message}</p>
                                    <span className="notification-time">
                                        {formatTime(notification.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
                .notifications-page {
                    min-height: 100vh;
                    background: #000000;
                    padding: 20px;
                }

                .header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #333;
                }

                .back-btn {
                    background: transparent;
                    border: 1px solid #333;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .back-btn:hover {
                    border-color: #ff6b9d;
                    background: rgba(255, 107, 157, 0.1);
                }

                h1 {
                    color: white;
                    font-size: 28px;
                    font-weight: 700;
                    margin: 0;
                    flex: 1;
                }

                .mark-all-btn {
                    background: transparent;
                    border: 1px solid #666;
                    color: #888;
                    padding: 8px 16px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s;
                }

                .mark-all-btn:hover {
                    border-color: #ff6b9d;
                    color: #ff6b9d;
                }

                .notifications-container {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .empty-state {
                    text-align: center;
                    padding: 80px 20px;
                }

                .empty-icon {
                    font-size: 80px;
                    margin-bottom: 20px;
                    opacity: 0.3;
                }

                .empty-state h2 {
                    color: white;
                    font-size: 24px;
                    margin-bottom: 12px;
                }

                .empty-state p {
                    color: #888;
                    font-size: 16px;
                }

                .notifications-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .notification-card {
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-radius: 16px;
                    padding: 16px;
                    display: flex;
                    gap: 16px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .notification-card:hover {
                    background: #222;
                    border-color: #444;
                }

                .notification-card.unread {
                    background: rgba(255, 107, 157, 0.05);
                    border-color: rgba(255, 107, 157, 0.3);
                }

                .notification-icon {
                    font-size: 32px;
                    width: 50px;
                    height: 50px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 12px;
                    flex-shrink: 0;
                }

                .notification-content {
                    flex: 1;
                }

                .notification-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .notification-header h3 {
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                    margin: 0;
                }

                .unread-dot {
                    width: 8px;
                    height: 8px;
                    background: #ff6b9d;
                    border-radius: 50%;
                }

                .notification-content p {
                    color: #ccc;
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0 0 8px 0;
                }

                .notification-time {
                    color: #666;
                    font-size: 12px;
                }

                @media (max-width: 768px) {
                    .notifications-page {
                        padding: 16px;
                    }

                    h1 {
                        font-size: 24px;
                    }

                    .notification-card {
                        padding: 12px;
                    }
                }
            `}</style>
        </div>
    );
}
