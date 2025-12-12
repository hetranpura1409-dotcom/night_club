import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Nightclub App - Book Your Night',
    description: 'Browse and book nightclub events',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
