import type { Metadata } from 'next';
import Sidebar from '../components/Sidebar';
import './globals.css';

export const metadata: Metadata = {
    title: 'Nightclub Admin Dashboard',
    description: 'Admin panel for managing nightclub app',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body style={{ display: 'flex' }}>
                <Sidebar />
                <main style={{ flex: 1, marginLeft: '250px', padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
                    {children}
                </main>
            </body>
        </html>
    );
}
