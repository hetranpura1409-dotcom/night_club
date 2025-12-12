'use client';

import { useEffect, useState } from 'react';
import styles from './users.module.css';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/auth/users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>👥 Registered Users</h1>
                <p className={styles.subtitle}>
                    Total Users: <strong>{users.length}</strong>
                </p>
            </div>

            {loading && (
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading users...</p>
                </div>
            )}

            {error && (
                <div className={styles.error}>
                    <p>❌ {error}</p>
                    <button onClick={fetchUsers} className={styles.retryButton}>
                        🔄 Retry
                    </button>
                </div>
            )}

            {!loading && !error && users.length === 0 && (
                <div className={styles.empty}>
                    <p>📭 No users registered yet</p>
                    <p className={styles.emptyHint}>
                        Users will appear here after signing up via the mobile app or web app
                    </p>
                </div>
            )}

            {!loading && !error && users.length > 0 && (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className={styles.nameCell}>
                                        <div className={styles.avatar}>
                                            {user.firstName.charAt(0).toUpperCase()}
                                            {user.lastName.charAt(0).toUpperCase()}
                                        </div>
                                        <span>
                                            {user.firstName} {user.lastName}
                                        </span>
                                    </td>
                                    <td>{user.email}</td>
                                    <td className={styles.mobileCell}>{user.mobile}</td>
                                    <td className={styles.dateCell}>
                                        {formatDate(user.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className={styles.footer}>
                <button onClick={fetchUsers} className={styles.refreshButton}>
                    🔄 Refresh
                </button>
            </div>
        </div>
    );
}
