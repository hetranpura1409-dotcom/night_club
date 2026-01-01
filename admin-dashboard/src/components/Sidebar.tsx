'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Dashboard', icon: '📊' },
        { href: '/users', label: 'Users', icon: '👥' },
        { href: '/nightclubs', label: 'Nightclubs', icon: '🏢' },
        { href: '/events', label: 'Events', icon: '📅' },
        { href: '/bookings', label: 'Bookings', icon: '📋' },
        { href: '/check-in', label: 'Check-In', icon: '🎫' },
        { href: '/notifications', label: 'Notifications', icon: '🔔' },
    ];

    return (
        <div className={styles.sidebar}>
            <div className={styles.logo}>Nightclub Admin</div>
            <nav className={styles.nav}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`${styles.link} ${pathname === link.href ? styles.active : ''
                            }`}
                    >
                        <span style={{ marginRight: '10px' }}>{link.icon}</span>
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
