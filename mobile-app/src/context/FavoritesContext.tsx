/**
 * FavoritesContext — 100% local storage, no API calls.
 * Favorites are persisted to AsyncStorage so they survive app restarts.
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Nightclub } from '../types';

interface FavoritesContextType {
    favorites: Nightclub[];
    toggleFavorite: (venue: Nightclub) => void;
    isFavorite: (venueId: number) => boolean;
    loading: boolean;
    refreshFavorites: () => void;
}

const STORAGE_KEY = '@niteways_favorites';

const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    toggleFavorite: () => {},
    isFavorite: () => false,
    loading: false,
    refreshFavorites: () => {},
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<Nightclub[]>([]);
    const [loading, setLoading]     = useState(true);

    // Load from AsyncStorage on mount
    const loadFavorites = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (raw) setFavorites(JSON.parse(raw));
        } catch (e) {
            console.warn('FavoritesContext: failed to load from storage', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadFavorites(); }, [loadFavorites]);

    // Persist whenever favorites change
    const persist = useCallback(async (updated: Nightclub[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
            console.warn('FavoritesContext: failed to persist', e);
        }
    }, []);

    const toggleFavorite = useCallback((venue: Nightclub) => {
        setFavorites(prev => {
            const exists = prev.some(v => v.id === venue.id);
            const updated = exists
                ? prev.filter(v => v.id !== venue.id)
                : [...prev, venue];
            persist(updated);
            return updated;
        });
    }, [persist]);

    const isFavorite = useCallback(
        (venueId: number) => favorites.some(v => v.id === venueId),
        [favorites],
    );

    return (
        <FavoritesContext.Provider value={{
            favorites,
            toggleFavorite,
            isFavorite,
            loading,
            refreshFavorites: loadFavorites,
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
