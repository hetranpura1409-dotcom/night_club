'use client';

import { useState, useEffect } from 'react';
import { getNightclubs, createNightclub, deleteNightclub, updateNightclub } from '../../services/api';

interface Nightclub {
    id: string;
    name: string;
    description: string;
    location: string;
    imageUrl: string;
}

export default function NightclubsPage() {
    const [nightclubs, setNightclubs] = useState<Nightclub[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        imageUrl: '',
    });
    const [loading, setLoading] = useState(false);

    // Edit modal state
    const [editingClub, setEditingClub] = useState<Nightclub | null>(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        description: '',
        location: '',
        imageUrl: '',
    });
    const [editLoading, setEditLoading] = useState(false);

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

    const openEditModal = (club: Nightclub) => {
        setEditingClub(club);
        setEditFormData({
            name: club.name,
            description: club.description,
            location: club.location,
            imageUrl: club.imageUrl || '',
        });
    };

    const closeEditModal = () => {
        setEditingClub(null);
        setEditFormData({ name: '', description: '', location: '', imageUrl: '' });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingClub) return;

        setEditLoading(true);
        try {
            await updateNightclub(editingClub.id, editFormData);
            closeEditModal();
            loadNightclubs();
        } catch (error) {
            console.error('Failed to update nightclub', error);
            alert('Failed to update nightclub');
        } finally {
            setEditLoading(false);
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
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => openEditModal(club)}
                                    style={{ color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(club.id)}
                                    style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </div>
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

            {/* Edit Modal */}
            {editingClub && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '12px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                    }}>
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1a1d29' }}>
                            ✏️ Edit Nightclub
                        </h2>
                        <form onSubmit={handleEditSubmit} style={{ display: 'grid', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#4b5563', fontSize: '14px' }}>Name</label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#4b5563', fontSize: '14px' }}>Description</label>
                                <textarea
                                    value={editFormData.description}
                                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#4b5563', fontSize: '14px' }}>Location</label>
                                <input
                                    type="text"
                                    value={editFormData.location}
                                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#4b5563', fontSize: '14px' }}>Image URL</label>
                                <input
                                    type="url"
                                    value={editFormData.imageUrl}
                                    onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                {editFormData.imageUrl && (
                                    <img
                                        src={editFormData.imageUrl}
                                        alt="Preview"
                                        style={{ width: '100%', height: '100px', objectFit: 'cover', marginTop: '10px', borderRadius: '4px' }}
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: '#f3f4f6',
                                        color: '#374151',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '500',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        backgroundColor: '#7C3AED',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: editLoading ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {editLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
