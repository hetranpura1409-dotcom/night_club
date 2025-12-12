'use client';

import { useState, useEffect } from 'react';
import { getNightclubs, createNightclub, deleteNightclub } from '../../services/api';

export default function NightclubsPage() {
    const [nightclubs, setNightclubs] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        imageUrl: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadNightclubs();
    }, []);

    const loadNightclubs = async () => {
        try {
            const data = await getNightclubs();
            setNightclubs(data);
        } catch (error) {
            console.error('Failed to load nightclubs', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createNightclub(formData);
            setFormData({ name: '', description: '', location: '', imageUrl: '' });
            loadNightclubs();
        } catch (error) {
            console.error('Failed to create nightclub', error);
            alert('Failed to create nightclub');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this nightclub?')) return;
        try {
            await deleteNightclub(id);
            loadNightclubs();
        } catch (error) {
            console.error('Failed to delete nightclub', error);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1a1d29' }}>
                Manage Nightclubs
            </h1>

            {/* Add Nightclub Form */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#4b5563' }}>Add New Nightclub</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>
                    <input
                        type="text"
                        placeholder="Nightclub Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <textarea
                        placeholder="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }}
                    />
                    <input
                        type="text"
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <input
                        type="url"
                        placeholder="Image URL (optional)"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '10px',
                            backgroundColor: '#7C3AED',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                        }}
                    >
                        {loading ? 'Creating...' : 'Add Nightclub'}
                    </button>
                </form>
            </div>

            {/* Nightclubs List */}
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {nightclubs.map((club) => (
                    <div key={club.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1d29' }}>{club.name}</h3>
                            <button
                                onClick={() => handleDelete(club.id)}
                                style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Delete
                            </button>
                        </div>
                        <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '5px' }}>📍 {club.location}</p>
                        <p style={{ color: '#4B5563', marginTop: '10px', fontSize: '14px' }}>{club.description}</p>
                        {club.imageUrl && (
                            <img
                                src={club.imageUrl}
                                alt={club.name}
                                style={{ width: '100%', height: '150px', objectFit: 'cover', marginTop: '15px', borderRadius: '4px' }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
