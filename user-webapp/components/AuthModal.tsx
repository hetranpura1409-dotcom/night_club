'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp, signIn } from '../services/api';

interface AuthModalProps {
    onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
    const router = useRouter();
    const [mode, setMode] = useState<'choice' | 'signup' | 'signin'>('choice');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await signUp(firstName, lastName, email, mobile, password);
            // Reset form
            setFirstName('');
            setLastName('');
            setEmail('');
            setMobile('');
            setPassword('');
            setConfirmPassword('');
            // Show success and redirect to sign-in
            setSuccessMessage('Account created successfully! Please sign in.');
            setTimeout(() => {
                setMode('signin');
                setSuccessMessage('');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn(email, password);
            localStorage.setItem('token', result.accessToken);
            localStorage.setItem('user', JSON.stringify(result.user));
            router.push('/browse');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const resetToChoice = () => {
        setMode('choice');
        setError('');
        setSuccessMessage('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setMobile('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.card}>
                <button onClick={onClose} style={styles.closeButton}>✕</button>
                <div style={styles.header}>
                    <h1 style={styles.emoji}>🎉</h1>
                    <h2 style={styles.title}>
                        {mode === 'choice' && 'Welcome to Niteways'}
                        {mode === 'signup' && 'Create Account'}
                        {mode === 'signin' && 'Welcome Back!'}
                    </h2>
                    <p style={styles.subtitle}>
                        {mode === 'choice' && 'Sign in or create a new account'}
                        {mode === 'signup' && 'Fill in your details to get started'}
                        {mode === 'signin' && 'Enter your credentials to continue'}
                    </p>
                </div>

                {mode === 'choice' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button onClick={() => setMode('signin')} style={styles.button}>
                            Sign In
                        </button>
                        <button onClick={() => setMode('signup')} style={{ ...styles.button, background: '#10B981' }}>
                            Create Account
                        </button>
                    </div>
                )}

                {mode === 'signup' && (
                    <form onSubmit={handleSignUp} style={styles.form}>
                        <div style={styles.row}>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                minLength={2}
                                style={styles.inputHalf}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                minLength={2}
                                style={styles.inputHalf}
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            required
                            pattern="[0-9]{10,15}"
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            style={styles.input}
                        />
                        <button type="submit" disabled={loading} style={styles.button}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                        <button type="button" onClick={resetToChoice} style={styles.backButton}>
                            ← Back
                        </button>
                    </form>
                )}

                {mode === 'signin' && (
                    <form onSubmit={handleSignIn} style={styles.form}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                        <button type="submit" disabled={loading} style={styles.button}>
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                        <button type="button" onClick={resetToChoice} style={styles.backButton}>
                            ← Back
                        </button>
                    </form>
                )}

                {successMessage && <p style={styles.success}>{successMessage}</p>}
                {error && <p style={styles.error}>{error}</p>}
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '40px',
        maxWidth: '500px',
        width: '90%',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        position: 'relative',
        animation: 'slideUp 0.3s ease-out',
    },
    closeButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        color: '#6B7280',
        padding: '5px',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    emoji: {
        fontSize: '64px',
        margin: '0 0 16px 0',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1a1d29',
        margin: '0 0 8px 0',
    },
    subtitle: {
        fontSize: '14px',
        color: '#4B5563',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    row: {
        display: 'flex',
        gap: '12px',
    },
    input: {
        padding: '14px',
        border: '2px solid #E5E7EB',
        borderRadius: '12px',
        fontSize: '16px',
        outline: 'none',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.8)',
        transition: 'all 0.2s',
    },
    inputHalf: {
        padding: '14px',
        border: '2px solid #E5E7EB',
        borderRadius: '12px',
        fontSize: '16px',
        outline: 'none',
        flex: 1,
        background: 'rgba(255, 255, 255, 0.8)',
        transition: 'all 0.2s',
    },
    button: {
        padding: '14px',
        background: '#7C3AED',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.1s',
        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
    },
    backButton: {
        padding: '10px',
        background: 'transparent',
        color: '#6B7280',
        border: 'none',
        fontSize: '14px',
        cursor: 'pointer',
    },
    success: {
        color: '#059669',
        fontSize: '14px',
        textAlign: 'center',
        marginTop: '16px',
        padding: '12px',
        background: '#D1FAE5',
        borderRadius: '12px',
        fontWeight: '500',
    },
    error: {
        color: '#DC2626',
        fontSize: '14px',
        textAlign: 'center',
        marginTop: '8px',
    },
};
