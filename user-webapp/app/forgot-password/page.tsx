'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Implement password reset logic
        console.log('Password reset requested');
    };

    return (
        <div className="forgot-container">
            <div className="forgot-content">
                <div className="branding">
                    <h1 className="logo">NITEWAYS</h1>
                    <p className="tagline">Reset your password</p>
                </div>

                <form onSubmit={handleSubmit} className="forgot-form">
                    <p className="instruction">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>

                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="input-field"
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Send Reset Link
                    </button>

                    <Link href="/signin" className="back-link">
                        ← Back to Sign In
                    </Link>
                </form>
            </div>

            <style jsx>{`
                .forgot-container {
                    min-height: 100vh;
                    background: #000000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }

                .forgot-content {
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

                .forgot-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .instruction {
                    color: #8B8B8B;
                    font-size: 14px;
                    line-height: 1.5;
                    margin: 0;
                    text-align: center;
                }

                .input-group {
                    position: relative;
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

                .submit-button {
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
                }

                .submit-button:hover {
                    background: #FFFFFF;
                    color: #000000;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
                }

                .back-link {
                    text-align: center;
                    color: #8B8B8B;
                    font-size: 14px;
                    text-decoration: none;
                    transition: color 0.2s;
                    display: block;
                }

                .back-link:hover {
                    color: #FFFFFF;
                }

                @media (max-width: 640px) {
                    .forgot-content {
                        padding: 32px 24px;
                    }

                    .logo {
                        font-size: 40px;
                    }
                }
            `}</style>
        </div>
    );
}
