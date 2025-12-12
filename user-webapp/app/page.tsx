'use client';

import { useRouter } from 'next/navigation';
import LiquidEther from '../components/LiquidEther';
import ShinyText from '../components/ShinyText';
import MagneticButton from '../components/MagneticButton';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div style={styles.container}>
            <div style={styles.backgroundWrapper}>
                <LiquidEther
                    colors={['#5227FF', '#FF9FFC', '#B19EEF']}
                    mouseForce={20}
                    cursorSize={100}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>

            <div style={styles.content}>
                {/* Hero Section */}
                <div style={styles.hero}>
                    <ShinyText
                        text="Experience the Night"
                        speed={3}
                        className="hero-title"
                    />
                    <p style={styles.subtitle}>
                        Exclusive access to the city's best vibes. <br />
                        Discover nightclubs, book events, and live the moment.
                    </p>

                    <div style={styles.ctaContainer}>
                        <MagneticButton
                            onClick={() => router.push('/signin')}
                            style={styles.ctaButton}
                        >
                            Enter Niteways →
                        </MagneticButton>
                    </div>
                </div>

                {/* Scrolling Explanation Section */}
                <div style={styles.scrollSection}>
                    <div style={styles.featureBlock}>
                        <h3 style={styles.featureTitle}>Curated Nightlife</h3>
                        <p style={styles.featureText}>
                            Niteways isn't just a directory; it's a curated collection of the city's most exclusive venues.
                            We partner with top-tier nightclubs to bring you an experience that goes beyond the ordinary.
                        </p>
                    </div>

                    <div style={styles.featureBlock}>
                        <h3 style={styles.featureTitle}>Seamless Booking</h3>
                        <p style={styles.featureText}>
                            Forget the guestlist hassle. With Niteways, you can secure your spot, book VIP tables,
                            and purchase event tickets instantly from your phone. Your night out, guaranteed.
                        </p>
                    </div>

                    <div style={styles.featureBlock}>
                        <h3 style={styles.featureTitle}>Real-time Pulse</h3>
                        <p style={styles.featureText}>
                            Know where the party is before you leave the house. Our live updates and community-driven
                            vibes let you tap into the pulse of the city in real-time.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes shine {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 100% 50%; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .hero-title {
                    font-size: 64px;
                    font-weight: 800;
                    margin-bottom: 24px;
                    line-height: 1.1;
                    letter-spacing: -1px;
                }
                @media (max-width: 768px) {
                    .hero-title {
                        font-size: 42px;
                    }
                }
            `}</style>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        minHeight: '100vh',
        position: 'relative',
        overflowX: 'hidden',
        background: '#000', // Fallback
    },
    backgroundWrapper: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
    },
    content: {
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center',
    },
    hero: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '800px',
    },
    subtitle: {
        fontSize: '20px',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '40px',
        lineHeight: '1.6',
        maxWidth: '600px',
        margin: '0 auto 40px auto',
    },
    ctaContainer: {
        display: 'flex',
        justifyContent: 'center',
    },
    ctaButton: {
        padding: '16px 32px',
        background: 'white',
        color: '#7C3AED',
        border: 'none',
        borderRadius: '50px',
        fontSize: '18px',
        fontWeight: '700',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
    },
    scrollSection: {
        maxWidth: '800px',
        padding: '100px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '100px',
        paddingBottom: '150px', // Extra space at bottom
    },
    featureBlock: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '40px',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'left',
        transition: 'transform 0.3s ease',
    },
    featureTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '16px',
        background: 'linear-gradient(to right, #fff, #a5b4fc)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    featureText: {
        fontSize: '18px',
        color: 'rgba(255, 255, 255, 0.7)',
        lineHeight: '1.6',
    },
};
