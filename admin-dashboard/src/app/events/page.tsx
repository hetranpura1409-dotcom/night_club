'use client';

import { useState, useEffect } from 'react';
import { getEvents, createEvent, deleteEvent, getNightclubs } from '../../services/api';

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [nightclubs, setNightclubs] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        price: 0,
        imageUrl: '',
        nightclubId: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadEvents();
        loadNightclubs();
    }, []);

    const loadEvents = async () => {
        try {
            const data = await getEvents();
            setEvents(data);
        } catch (error) {
            console.error('Failed to load events', error);
        }
    };

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
            await createEvent(formData);
            setFormData({ name: '', description: '', date: '', price: 0, imageUrl: '', nightclubId: '' });
            loadEvents();
        } catch (error) {
            console.error('Failed to create event', error);
            alert('Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            await deleteEvent(id);
            loadEvents();
        } catch (error) {
            console.error('Failed to delete event', error);
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1a1d29' }}>
                Manage Events
            </h1>

            {/* Add Event Form */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '15px', color: '#4b5563' }}>Add New Event</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>
                    <select
                        value={formData.nightclubId}
                        onChange={(e) => setFormData({ ...formData, nightclubId: e.target.value })}
                        required
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    >
                        <option value="">Select Nightclub</option>
                        {nightclubs.map((club) => (
                            <option key={club.id} value={club.id}>
                                {club.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Event Name"
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
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        required
                        min="0"
                        step="0.01"
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
                        {loading ? 'Creating...' : 'Add Event'}
                    </button>
                </form>
            </div>

            {/* Events List */}
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {events.map((event) => (
                    <div key={event.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1d29' }}>{event.name}</h3>
                            <button
                                onClick={() => handleDelete(event.id)}
                                style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                Delete
                            </button>
                        </div>
                        <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '5px' }}>
                            🏢 {event.nightclub?.name || 'Unknown Club'}
                        </p>
                        <p style={{ color: '#4B5563', marginTop: '10px', fontSize: '14px' }}>{event.description}</p>
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                            <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                            <span style={{ fontWeight: 'bold', color: '#7C3AED' }}>${event.price}</span>
                        </div>
                        {event.imageUrl && (
                            <img
                                src={event.imageUrl}
                                alt={event.name}
                                style={{ width: '100%', height: '150px', objectFit: 'cover', marginTop: '15px', borderRadius: '4px' }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
