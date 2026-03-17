import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    Dimensions,
    FlatList,
    Image,
    Platform,
} from 'react-native';
import Mapbox from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/Ionicons';
import { Nightclub } from '../types';
import BottomNav from '../components/BottomNav';
import { MOCK_VENUES } from '../data/mockVenues';
import MAPBOX_ACCESS_TOKEN from '../config/mapbox';

// Base URL to fetch the Mapbox style JSON
const STYLE_FETCH_URL = `https://api.mapbox.com/styles/v1/mapbox/dark-v10?access_token=${MAPBOX_ACCESS_TOKEN}`;

/**
 * MapLibre SDK (the @rnmapbox/maps default backend) cannot parse mapbox:// URIs.
 * This function fetches the Mapbox style JSON and rewrites every internal
 * mapbox:// reference to its HTTPS equivalent so MapLibre can load them.
 */
async function fetchMapboxStyleAsHTTPS(): Promise<string> {
    const res = await fetch(STYLE_FETCH_URL);
    if (!res.ok) throw new Error(`Style fetch failed: ${res.status}`);
    const style = await res.json();

    // Sprites  e.g. mapbox://sprites/mapbox/dark-v10
    // Maps to https://api.mapbox.com/styles/v1/{user}/{style}/sprite
    if (typeof style.sprite === 'string' && style.sprite.startsWith('mapbox://sprites/')) {
        const spritePath = style.sprite.replace('mapbox://sprites/', '');
        style.sprite = `https://api.mapbox.com/styles/v1/${spritePath}/sprite?access_token=${MAPBOX_ACCESS_TOKEN}`;
    }

    // Glyphs  e.g. mapbox://fonts/mapbox/{fontstack}/{range}.pbf
    // Preserve the username (mapbox/) that follows "fonts/" in the original URL.
    if (typeof style.glyphs === 'string' && style.glyphs.startsWith('mapbox://fonts/')) {
        style.glyphs =
            style.glyphs.replace('mapbox://fonts/', 'https://api.mapbox.com/fonts/v1/') +
            `?access_token=${MAPBOX_ACCESS_TOKEN}`;
    }

    // Tile sources  e.g. { "url": "mapbox://mapbox.mapbox-streets-v8" }
    if (style.sources) {
        for (const src of Object.values(style.sources) as any[]) {
            if (typeof src.url === 'string' && src.url.startsWith('mapbox://')) {
                const tileset = src.url.replace('mapbox://', '');
                src.url = `https://api.mapbox.com/v4/${tileset}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
            }
            // Inline tile URL arrays
            if (Array.isArray(src.tiles)) {
                src.tiles = src.tiles.map((t: string) =>
                    t.startsWith('mapbox://') ? t.replace('mapbox://', 'https://api.mapbox.com/v4/') : t
                );
            }
        }
    }

    return JSON.stringify(style);
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_MARGIN = 10;
const SNAP_INTERVAL = CARD_WIDTH + (CARD_MARGIN * 2);

interface InteractiveMapScreenProps {
    navigation: any;
}

type CategoryFilter = 'all' | 'Nightclub' | 'events';

const categoryFilters: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'Nightclub', label: 'Nightclub' },
    { id: 'events', label: 'Events' },
];

const InteractiveMapScreen: React.FC<InteractiveMapScreenProps> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
    const [selectedVenue, setSelectedVenue] = useState<Nightclub | null>(null);
    const [mapStyle, setMapStyle] = useState<string | null>(null);
    const mapCamera = useRef<any>(null);
    const flatListRef = useRef<FlatList>(null);

    // Fetch Mapbox style once, rewriting all mapbox:// URIs to HTTPS
    useEffect(() => {
        fetchMapboxStyleAsHTTPS()
            .then(setMapStyle)
            .catch(() => {
                // On failure fall back to direct HTTPS URL (tiles will load, sprites may warn)
                setMapStyle(STYLE_FETCH_URL);
            });
    }, []);

    // Filter venues
    const filteredVenues = useMemo(() => {
        let filtered = MOCK_VENUES.filter(v => v.latitude && v.longitude);

        if (selectedCategory !== 'all' && selectedCategory !== 'events') {
            filtered = filtered.filter(v => v.category === selectedCategory);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                v =>
                    v.name.toLowerCase().includes(query) ||
                    v.city.toLowerCase().includes(query) ||
                    v.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        if (filteredVenues.length > 0 && !selectedVenue) {
            setSelectedVenue(filteredVenues[0]);
        }
    }, [filteredVenues]);

    const handleVenuePress = (venue: Nightclub, index: number) => {
        setSelectedVenue(venue);
        mapCamera.current?.setCamera({
            centerCoordinate: [venue.longitude!, venue.latitude!],
            zoomLevel: 14,
            animationDuration: 1000,
        });
        flatListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    };

    const renderVenueCard = ({ item, index }: { item: Nightclub; index: number }) => (
        <TouchableOpacity
            style={[
                styles.card,
                selectedVenue?.id === item.id && styles.activeCard
            ]}
            onPress={() => handleVenuePress(item, index)}
            activeOpacity={0.9}
        >
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.cardPrice}>{item.priceLevel}</Text>
                </View>
                <View style={styles.cardMeta}>
                    <Icon name="location" size={12} color="#9CA3AF" />
                    <Text style={styles.cardCity}>{item.city}</Text>
                    <View style={styles.dot} />
                    <Text style={styles.cardCategory}>{item.category}</Text>
                </View>
                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => navigation.navigate('VenueDetail', { club: item })}
                >
                    <Text style={styles.bookButtonText}>Explore Venue</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const onScroll = (event: any) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / SNAP_INTERVAL);
        if (filteredVenues[index] && filteredVenues[index].id !== selectedVenue?.id) {
            const venue = filteredVenues[index];
            setSelectedVenue(venue);
            mapCamera.current?.setCamera({
                centerCoordinate: [venue.longitude!, venue.latitude!],
                zoomLevel: 14,
                animationDuration: 1000,
            });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Full Screen Mapbox Map — renders once the HTTPS-patched style JSON is ready */}
            {mapStyle ? (
            <Mapbox.MapView
                style={styles.map}
                styleURL={mapStyle}
                logoEnabled={false}
                compassEnabled
            >
                <Mapbox.Camera
                    ref={mapCamera}
                    zoomLevel={12}
                    centerCoordinate={
                        selectedVenue && selectedVenue.longitude && selectedVenue.latitude
                            ? [selectedVenue.longitude, selectedVenue.latitude]
                            : filteredVenues.length > 0
                                ? [filteredVenues[0].longitude!, filteredVenues[0].latitude!]
                                : [2.3522, 48.8566] // fallback (Paris)
                    }
                    animationDuration={0}
                />

                {filteredVenues.map((venue) => (
                    <Mapbox.PointAnnotation
                        key={venue.id}
                        id={String(venue.id)}
                        coordinate={[venue.longitude!, venue.latitude!]}
                        onSelected={() => {
                            const index = filteredVenues.findIndex(v => v.id === venue.id);
                            if (index !== -1) {
                                handleVenuePress(venue, index);
                            }
                        }}
                    >
                        <View style={styles.markerContainer}>
                            <View style={[
                                styles.markerPulse,
                                selectedVenue?.id === venue.id && styles.markerPulseActive
                            ]} />
                            <View style={[
                                styles.markerDot,
                                selectedVenue?.id === venue.id && styles.markerDotActive
                            ]} />
                        </View>
                    </Mapbox.PointAnnotation>
                ))}
            </Mapbox.MapView>
            ) : (
                <View style={[styles.map, styles.mapLoading]}>
                    <Text style={styles.mapLoadingText}>Loading map…</Text>
                </View>
            )}

            {/* Overlays */}
            <View style={styles.overlay}>
                {/* Search Bar */}
                <View style={styles.searchSection}>
                    <View style={styles.searchContainer}>
                        <Icon name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search high-end clubs..."
                            placeholderTextColor="#6B7280"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterList}
                    >
                        {categoryFilters.map(filter => (
                            <TouchableOpacity
                                key={filter.id}
                                style={[
                                    styles.filterChip,
                                    selectedCategory === filter.id && styles.filterChipActive
                                ]}
                                onPress={() => setSelectedCategory(filter.id)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    selectedCategory === filter.id && styles.filterTextActive
                                ]}>{filter.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Bottom Carousel */}
                <View style={styles.carouselContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={filteredVenues}
                        renderItem={renderVenueCard}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={SNAP_INTERVAL}
                        decelerationRate="fast"
                        contentContainerStyle={styles.carouselContent}
                        onMomentumScrollEnd={onScroll}
                    />
                </View>
            </View>

            {/* Bottom Navigation */}
            <BottomNav activeTab="Map" navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    map: {
        flex: 1,
    },
    mapLoading: {
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapLoadingText: {
        color: '#F7C948',
        fontSize: 14,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        pointerEvents: 'box-none',
    },
    searchSection: {
        paddingTop: Platform.OS === 'ios' ? 60 : 50,
        paddingHorizontal: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(28, 28, 30, 0.95)',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 15,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },
    filterList: {
        gap: 10,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(28, 28, 30, 0.95)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    filterChipActive: {
        backgroundColor: '#F7C948',
        borderColor: '#F7C948',
    },
    filterText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#000',
    },
    markerContainer: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#F7C948',
    },
    markerDotActive: {
        backgroundColor: '#F7C948',
        borderColor: '#fff',
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    markerPulse: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(247, 201, 72, 0.4)',
    },
    markerPulseActive: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(247, 201, 72, 0.2)',
    },
    carouselContainer: {
        position: 'absolute',
        bottom: 100,
        width: width,
    },
    carouselContent: {
        paddingHorizontal: (width - CARD_WIDTH) / 2,
    },
    card: {
        width: CARD_WIDTH,
        height: 120,
        backgroundColor: 'rgba(28, 28, 30, 0.98)',
        marginHorizontal: CARD_MARGIN,
        borderRadius: 20,
        flexDirection: 'row',
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    activeCard: {
        borderColor: '#F7C948',
    },
    cardImage: {
        width: 100,
        height: '100%',
        borderRadius: 14,
    },
    cardContent: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'space-between',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
    },
    cardPrice: {
        color: '#F7C948',
        fontSize: 12,
        fontWeight: 'bold',
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    cardCity: {
        color: '#9CA3AF',
        fontSize: 12,
        marginLeft: 4,
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: '#4B5563',
        marginHorizontal: 8,
    },
    cardCategory: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    bookButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 6,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    }
});

export default InteractiveMapScreen;
