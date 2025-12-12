'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        gender: '',
        birthMonth: 'September',
        birthDay: '17',
        birthYear: '2021',
    });
    const [saving, setSaving] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showImageViewer, setShowImageViewer] = useState(false);

    const compressImage = (file: File, maxWidth: number = 400): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with 0.7 quality
                    const compressed = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressed);
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('Image must be less than 10MB');
                return;
            }
            try {
                const compressed = await compressImage(file);
                setProfileImage(compressed);
                localStorage.setItem('profileImage', compressed);
            } catch (error) {
                console.error('Failed to process image:', error);
                alert('Failed to upload image. Please try a smaller image.');
            }
        }
    };

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
    const years = Array.from({ length: 50 }, (_, i) => String(2024 - i));

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/signin');
            return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData(prev => ({
            ...prev,
            firstName: parsedUser.firstName || '',
            lastName: parsedUser.lastName || '',
            email: parsedUser.email || '',
            phone: parsedUser.mobile || '',
        }));

        // Load profile image from localStorage
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // TODO: Implement profile update API call
            console.log('Saving profile:', formData);
            // Update local storage
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to save profile:', error);
            alert('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="profile-container">
            {/* Header */}
            <div className="header">
                <button onClick={() => router.back()} className="back-button">
                    ←
                </button>
                <h1 className="title">Profile</h1>
                <div style={{ width: '40px' }}></div>
            </div>

            {/* Profile Photo */}
            <div className="photo-section">
                <div className="photo-container">
                    <div
                        className="photo-placeholder"
                        onClick={() => profileImage && setShowImageViewer(true)}
                        style={{ cursor: profileImage ? 'pointer' : 'default' }}
                    >
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="profile-image" />
                        ) : (
                            <span className="edit-icon">📷</span>
                        )}
                    </div>
                    <label htmlFor="photo-upload" className="photo-edit-button">
                        <span>✎</span>
                    </label>
                    <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>

            {/* Image Viewer Modal */}
            {showImageViewer && profileImage && (
                <div className="image-viewer-overlay" onClick={() => setShowImageViewer(false)}>
                    <div className="image-viewer-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-viewer" onClick={() => setShowImageViewer(false)}>×</button>
                        <img src={profileImage} alt="Profile" className="viewer-image" />
                    </div>
                </div>
            )}

            {/* User ID */}
            {(user?.userCode || user?.id) && (
                <div className="user-id-section">
                    <span className="user-id-label">Niteways ID</span>
                    <div
                        className="user-id-value"
                        onClick={() => {
                            navigator.clipboard.writeText(user.userCode || user.id);
                            alert('User ID copied to clipboard!');
                        }}
                        title="Click to copy"
                    >
                        <span className="user-id-text">{user.userCode || user.id}</span>
                        <span className="copy-icon">📋</span>
                    </div>
                </div>
            )}

            {/* Contact Section */}
            <div className="section">
                <h2 className="section-title">Contact</h2>

                <div className="input-row">
                    <span className="input-icon">👤</span>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className="input-field"
                    />
                </div>

                <div className="input-row">
                    <span className="input-icon">👤</span>
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className="input-field"
                    />
                </div>

                <div className="input-row">
                    <span className="input-icon">🇸🇪</span>
                    <input
                        type="tel"
                        placeholder="+46 70-956 37 64"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="input-field"
                    />
                </div>

                <div className="input-row">
                    <span className="input-icon">✉️</span>
                    <input
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="input-field"
                    />
                </div>
            </div>

            {/* Gender Section */}
            <div className="section">
                <div className="gender-row">
                    <span className="section-title" style={{ marginBottom: 0 }}>Select Gender</span>
                    <select
                        value={formData.gender}
                        onChange={(e) => handleChange('gender', e.target.value)}
                        className="gender-select"
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not">Prefer not to say</option>
                    </select>
                </div>
            </div>

            {/* Birthday Section */}
            <div className="section">
                <h2 className="section-title">Birthday</h2>
                <div className="birthday-picker">
                    <select
                        value={formData.birthMonth}
                        onChange={(e) => handleChange('birthMonth', e.target.value)}
                        className="date-select month"
                    >
                        {months.map(month => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                    <select
                        value={formData.birthDay}
                        onChange={(e) => handleChange('birthDay', e.target.value)}
                        className="date-select day"
                    >
                        {days.map(day => (
                            <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                    <select
                        value={formData.birthYear}
                        onChange={(e) => handleChange('birthYear', e.target.value)}
                        className="date-select year"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Social Interactions */}
            <div className="section">
                <h2 className="section-title">Social Interactions</h2>

                <div className="social-row">
                    <div className="social-icon instagram">📷</div>
                    <span className="social-name">Instagram</span>
                    <button className="link-button">🔗</button>
                </div>

                <div className="social-row">
                    <div className="social-icon facebook">f</div>
                    <span className="social-name">Facebook</span>
                    <button className="link-button">🔗</button>
                </div>
            </div>

            {/* Save Button */}
            <div className="save-section">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="save-button"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <style jsx>{`
                .profile-container {
                    min-height: 100vh;
                    background: #000000;
                    padding: 0 20px 40px 20px;
                    color: #FFFFFF;
                }

                .content-wrapper {
                    max-width: 600px;
                    margin: 0 auto;
                }

                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 0;
                    position: sticky;
                    top: 0;
                    background: #000000;
                    z-index: 10;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .back-button {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: #FFFFFF;
                    font-size: 20px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }

                .back-button:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .title {
                    font-size: 18px;
                    font-weight: 600;
                    margin: 0;
                }

                .photo-section {
                    display: flex;
                    justify-content: center;
                    padding: 20px 0 40px 0;
                }

                .photo-container {
                    position: relative;
                }

                .photo-placeholder {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                    transition: border-color 0.2s;
                }

                .photo-placeholder:hover {
                    border-color: rgba(255, 255, 255, 0.5);
                }

                .edit-icon {
                    font-size: 32px;
                    opacity: 0.7;
                }

                .profile-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 50%;
                }

                .photo-edit-button {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    color: #000000;
                    border: 2px solid #000000;
                    cursor: pointer;
                    transition: transform 0.2s, background 0.2s;
                }

                .photo-edit-button:hover {
                    transform: scale(1.1);
                    background: #FFFFFF;
                }

                .image-viewer-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .image-viewer-content {
                    position: relative;
                    max-width: 90vw;
                    max-height: 90vh;
                }

                .viewer-image {
                    max-width: 90vw;
                    max-height: 85vh;
                    object-fit: contain;
                    border-radius: 8px;
                }

                .close-viewer {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    background: none;
                    border: none;
                    color: #FFFFFF;
                    font-size: 32px;
                    cursor: pointer;
                    padding: 8px;
                    transition: opacity 0.2s;
                }

                .close-viewer:hover {
                    opacity: 0.7;
                }

                .user-id-section {
                    text-align: center;
                    margin-bottom: 32px;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .user-id-label {
                    font-size: 12px;
                    color: #8B8B8B;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: block;
                    margin-bottom: 8px;
                }

                .user-id-value {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 10px 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .user-id-value:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .user-id-text {
                    font-size: 12px;
                    font-family: monospace;
                    color: #FFFFFF;
                    word-break: break-all;
                }

                .copy-icon {
                    font-size: 14px;
                    opacity: 0.7;
                }

                .section {
                    margin-bottom: 32px;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .section-title {
                    font-size: 14px;
                    color: #8B8B8B;
                    margin: 0 0 16px 0;
                    font-weight: 400;
                }

                .input-row {
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                }

                .input-icon {
                    font-size: 18px;
                    margin-right: 12px;
                    opacity: 0.7;
                    flex-shrink: 0;
                }

                .input-field {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: #FFFFFF;
                    font-size: 16px;
                    outline: none;
                    min-width: 0;
                }

                .input-field::placeholder {
                    color: #666666;
                }

                .gender-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .gender-select {
                    background: transparent;
                    border: none;
                    color: #8B8B8B;
                    font-size: 14px;
                    outline: none;
                    cursor: pointer;
                    padding: 8px 0;
                }

                .gender-select option {
                    background: #1a1a1a;
                    color: #FFFFFF;
                }

                .birthday-picker {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    padding: 20px 0;
                    flex-wrap: wrap;
                }

                .date-select {
                    background: transparent;
                    border: none;
                    color: #FFFFFF;
                    font-size: 18px;
                    outline: none;
                    cursor: pointer;
                    text-align: center;
                    appearance: none;
                    -webkit-appearance: none;
                }

                .date-select.month {
                    width: 120px;
                }

                .date-select.day,
                .date-select.year {
                    width: 80px;
                }

                .date-select option {
                    background: #1a1a1a;
                    color: #FFFFFF;
                }

                .social-row {
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 12px;
                }

                .social-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    font-size: 16px;
                    flex-shrink: 0;
                }

                .social-icon.instagram {
                    background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
                }

                .social-icon.facebook {
                    background: #1877F2;
                    font-weight: bold;
                }

                .social-name {
                    flex: 1;
                    font-size: 16px;
                }

                .link-button {
                    background: none;
                    border: none;
                    color: #8B8B8B;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 8px;
                    transition: color 0.2s;
                    flex-shrink: 0;
                }

                .link-button:hover {
                    color: #FFFFFF;
                }

                .save-section {
                    padding: 20px 0;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .save-button {
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

                .save-button:hover:not(:disabled) {
                    background: #FFFFFF;
                    color: #000000;
                }

                .save-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Mobile styles (default) */
                @media (max-width: 480px) {
                    .profile-container {
                        padding: 0 16px 32px 16px;
                    }

                    .photo-placeholder {
                        width: 100px;
                        height: 100px;
                    }

                    .input-row, .social-row {
                        padding: 14px;
                    }

                    .input-field {
                        font-size: 15px;
                    }

                    .date-select {
                        font-size: 16px;
                    }

                    .date-select.month {
                        width: 100px;
                    }

                    .date-select.day,
                    .date-select.year {
                        width: 60px;
                    }

                    .birthday-picker {
                        gap: 12px;
                    }

                    .save-button {
                        padding: 16px;
                        font-size: 15px;
                    }
                }

                /* Tablet styles */
                @media (min-width: 481px) and (max-width: 768px) {
                    .profile-container {
                        padding: 0 24px 40px 24px;
                    }
                }

                /* Desktop styles */
                @media (min-width: 769px) {
                    .profile-container {
                        padding: 0 40px 60px 40px;
                    }

                    .photo-placeholder {
                        width: 140px;
                        height: 140px;
                    }

                    .edit-icon {
                        font-size: 28px;
                    }

                    .input-row, .social-row {
                        padding: 18px 20px;
                    }

                    .date-select {
                        font-size: 20px;
                    }

                    .date-select.month {
                        width: 140px;
                    }

                    .date-select.day,
                    .date-select.year {
                        width: 90px;
                    }
                }
            `}</style>
        </div>
    );
}
