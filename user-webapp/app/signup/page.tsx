'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '../../services/api';

export default function SignUpPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await signUp(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.phone,
                formData.password
            );
            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                router.push('/signin');
            }, 2000);
        } catch (err: any) {
            console.error('Sign up failed:', err);
            setError(err.response?.data?.message || 'Sign up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignUp = (provider: string) => {
        alert(`Social sign up with ${provider} coming soon!`);
    };

    return (
        <div className="signup-container">
            <div className="signup-content">
                {/* Logo & Branding */}
                <div className="branding">
                    <h1 className="logo">NITEWAYS</h1>
                    <p className="tagline">Your night out starts here.</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                {/* Sign Up Form */}
                <form onSubmit={handleSignUp} className="signup-form">
                    <div className="name-row">
                        <div className="input-group half">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>
                        <div className="input-group half">
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="input-field"
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Toggle password visibility"
                        >
                            {showPassword ? '👁️' : '👁️'}
                        </button>
                    </div>

                    <div className="input-group">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label="Toggle password visibility"
                        >
                            {showConfirmPassword ? '👁️' : '👁️'}
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="signup-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <p className="signin-link">
                        Already have an account?{' '}
                        <Link href="/signin">
                            Log in here
                        </Link>
                    </p>
                </form>

                {/* Social Sign Up */}
                <div className="social-signup">
                    <p className="social-text">Or sign up with</p>
                    <div className="social-buttons">
                        <button
                            onClick={() => handleSocialSignUp('facebook')}
                            className="social-button facebook"
                            aria-label="Sign up with Facebook"
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </button>

                        <button
                            onClick={() => handleSocialSignUp('google')}
                            className="social-button google"
                            aria-label="Sign up with Google"
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </button>

                        <button
                            onClick={() => handleSocialSignUp('apple')}
                            className="social-button apple"
                            aria-label="Sign up with Apple"
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .signup-container {
                    min-height: 100vh;
                    background: #000000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .signup-content {
                    width: 100%;
                    max-width: 440px;
                    padding: 40px 30px;
                }

                .branding {
                    text-align: center;
                    margin-bottom: 48px;
                }

                .logo {
                    font-size: 48px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    color: #FFFFFF;
                    margin: 0 0 12px 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }

                .tagline {
                    font-size: 16px;
                    color: #8B8B8B;
                    margin: 0;
                }

                .error-message {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ef4444;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    text-align: center;
                    margin-bottom: 16px;
                }

                .success-message {
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    color: #22c55e;
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    text-align: center;
                    margin-bottom: 16px;
                }

                .signup-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .name-row {
                    display: flex;
                    gap: 12px;
                }

                .input-group {
                    position: relative;
                }

                .input-group.half {
                    flex: 1;
                }

                .input-field {
                    width: 100%;
                    padding: 18px 20px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: #FFFFFF;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    box-sizing: border-box;
                }

                .input-field::placeholder {
                    color: #666666;
                }

                .input-field:focus {
                    outline: none;
                    background: rgba(255, 255, 255, 0.08);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .password-toggle {
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 20px;
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }

                .password-toggle:hover {
                    opacity: 1;
                }

                .signup-button {
                    width: 100%;
                    padding: 18px;
                    background: transparent;
                    border: 2px solid #FFFFFF;
                    border-radius: 999px;
                    color: #FFFFFF;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 8px;
                }

                .signup-button:hover:not(:disabled) {
                    background: #FFFFFF;
                    color: #000000;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
                }

                .signup-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .signin-link {
                    text-align: center;
                    color: #8B8B8B;
                    font-size: 14px;
                    margin: 8px 0 0 0;
                }

                .signin-link a {
                    color: #FFFFFF;
                    text-decoration: none;
                    font-weight: 600;
                    transition: opacity 0.2s;
                }

                .signin-link a:hover {
                    opacity: 0.8;
                }

                .social-signup {
                    margin-top: 32px;
                    padding-top: 32px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .social-text {
                    text-align: center;
                    color: #8B8B8B;
                    font-size: 14px;
                    margin: 0 0 20px 0;
                }

                .social-buttons {
                    display: flex;
                    justify-content: center;
                    gap: 24px;
                }

                .social-button {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 0;
                }

                .social-button.facebook {
                    background: #1877F2;
                    color: #FFFFFF;
                }

                .social-button.google {
                    background: #FFFFFF;
                }

                .social-button.apple {
                    background: #FFFFFF;
                    color: #000000;
                }

                .social-button:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
                }

                .social-button svg {
                    width: 24px;
                    height: 24px;
                }

                @media (max-width: 640px) {
                    .signup-content {
                        padding: 32px 24px;
                    }

                    .logo {
                        font-size: 40px;
                    }

                    .name-row {
                        flex-direction: column;
                        gap: 16px;
                    }

                    .social-button {
                        width: 48px;
                        height: 48px;
                    }
                }
            `}</style>
        </div>
    );
}
