import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import { Nightclub } from '../types';

interface FavoritesContextType {
    favorites: Nightclub[];
    toggleFavorite: (venue: Nightclub) => void;
    isFavorite: (venueId: number) => boolean;
    loading: boolean;
    refreshFavorites: () => void;
}

const FAVORITES_CACHE_KEY = '@favorites_cache';

const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    toggleFavorite: () => { },
    isFavorite: () => false,
    loading: false,
    refreshFavorites: () => { },
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigation = useNavigation<any>();
    const [favorites, setFavorites] = useState<Nightclub[]>([]);
    const [loading, setLoading] = useState(false);

    // Load favorites from API (with local cache fallback)
    const loadFavorites = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/favorites');
            const favItems = response.data;

            // Extract nightclub data from the favorites response
            const nightclubs: Nightclub[] = favItems
                .filter((fav: any) => fav.nightclub)
                .map((fav: any) => fav.nightclub);

            setFavorites(nightclubs);

            // Cache locally
            await AsyncStorage.setItem(FAVORITES_CACHE_KEY, JSON.stringify(nightclubs));
        } catch (error) {
            console.log('Could not load favorites from API, using cache:', error);
            // Fallback to local cache
            try {
                const cached = await AsyncStorage.getItem(FAVORITES_CACHE_KEY);
                if (cached) {
                    setFavorites(JSON.parse(cached));
                }
            } catch (cacheError) {
                console.error('Error loading favorites cache:', cacheError);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    const toggleFavorite = useCallback(async (venue: Nightclub) => {
        const exists = favorites.some(v => v.id === venue.id);

        // Optimistic update
        if (exists) {
            setFavorites(prev => prev.filter(v => v.id !== venue.id));
        } else {
            setFavorites(prev => [...prev, venue]);
        }

        try {
            if (exists) {
                await api.delete(`/favorites/${venue.id}`);
            } else {
                await api.post(`/favorites/${venue.id}`);
            }

            // Update cache
            const updated = exists
                ? favorites.filter(v => v.id !== venue.id)
                : [...favorites, venue];
            await AsyncStorage.setItem(FAVORITES_CACHE_KEY, JSON.stringify(updated));
        } catch (error: any) {
            console.error('Error toggling favorite:', error);
            // Revert optimistic update on error
            if (exists) {
                setFavorites(prev => [...prev, venue]);
            } else {
                setFavorites(prev => prev.filter(v => v.id !== venue.id));
            }

            if (error?.response?.status === 401) {
                // Ignore TS error since we don't have global navigation types strictly setup inside context
                // @ts-ignore
                navigation.navigate('Login');
            } else {
                Alert.alert("Error", "We couldn't save your favorite right now. Please try again.");
            }
        }
    }, [favorites, navigation]);

    const isFavorite = useCallback((venueId: number) => {
        return favorites.some(v => v.id === venueId);
    }, [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading, refreshFavorites: loadFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
