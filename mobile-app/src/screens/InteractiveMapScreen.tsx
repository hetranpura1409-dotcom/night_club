import React, { useState, useMemo, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import { Nightclub } from '../types';
import BottomNav from '../components/BottomNav';

const { width, height } = Dimensions.get('window');

interface InteractiveMapScreenProps {
    navigation: any;
}

// Mock club data
const MOCK_VENUES: Nightclub[] = [
    {
        id: 1,
        name: 'Pacha Barcelona',
        description: 'Iconic nightclub with world-class DJs',
        address: 'Av. del Paral·lel, 186',
        city: 'Barcelona',
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
            'https://images.unsplash.com/photo-1574391884720-2bbc37e3ae61?w=800&q=80',
            'https://images.unsplash.com/photo-1522158637959-30385a09e0da?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['House', 'Electronic', 'International DJs'],
    },
    {
        id: 2,
        name: 'Razzmatazz',
        description: 'Multi-room superclub',
        address: 'Barcelona',
        city: 'Barcelona',
        imageUrl: 'https://images.unsplash.com/photo-1571266028243-d220c6b1e5d9?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1571266028243-d220c6b1e5d9?w=800&q=80',
            'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&q=80',
            'https://images.unsplash.com/photo-1506157786151-58418c772266?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$',
        tags: ['Indie', 'Rock', 'Techno'],
    },
    {
        id: 3,
        name: 'Opium Barcelona',
        description: 'Beachfront club',
        address: 'Barcelona',
        city: 'Barcelona',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
            'https://images.unsplash.com/photo-1596771069132-561b8319ccd1?w=800&q=80',
            'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
        ],
        category: 'Beach Club',
        priceLevel: '$$$$',
        tags: ['House', 'Reggaeton', 'VIP'],
    },
    {
        id: 5,
        name: 'Fabric',
        description: 'Legendary underground club',
        address: 'London',
        city: 'London',
        imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
            'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80',
            'https://images.unsplash.com/photo-1545128485-c400e77d2758?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$',
        tags: ['Techno', 'Drum & Bass'],
    },
    {
        id: 6,
        name: 'Ministry of Sound',
        description: 'Iconic club',
        address: 'London',
        city: 'London',
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
            'https://images.unsplash.com/photo-1558470598-a5dda9640f6b?w=800&q=80',
            'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['House', 'Electronic'],
    },
    {
        id: 9,
        name: 'Academy LA',
        description: 'Hollywood nightclub',
        address: 'Los Angeles',
        city: 'Los Angeles',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
            'https://images.unsplash.com/photo-1518115598504-749e798729cc?w=800&q=80',
            'https://images.unsplash.com/photo-1506157786151-58418c772266?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['EDM', 'Hip Hop'],
    },
    {
        id: 13,
        name: 'LIV Miami',
        description: 'Ultra-luxe nightclub',
        address: 'Miami',
        city: 'Miami',
        imageUrl: 'https://images.unsplash.com/photo-1570876050997-2fdefce21852?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1570876050997-2fdefce21852?w=800&q=80',
            'https://images.unsplash.com/photo-1514525253440-b393452e8d03?w=800&q=80',
            'https://images.unsplash.com/photo-1545128485-c400e77d2758?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$$',
        tags: ['Celebrity', 'EDM', 'VIP'],
    },
];

type CategoryFilter = 'all' | 'Nightclub' | 'events';

const categoryFilters: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'Nightclub', label: 'Nightclub' },
    { id: 'events', label: 'Events' },
];

const InteractiveMapScreen: React.FC<InteractiveMapScreenProps> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
    const webViewRef = useRef<WebView>(null);

    // Filter venues
    const filteredVenues = useMemo(() => {
        let filtered = MOCK_VENUES;

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

    const handleVenuePress = (venue: Nightclub) => {
        navigation.navigate('VenueDetail', { club: venue });
    };

    // HTML for embedded map using Leaflet (open source, no API key needed)
    const mapHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100%; background: #0a0a0a; }
        .venue-marker {
            width: 16px;
            height: 16px;
            background: linear-gradient(135deg, #FF6B35, #FF8C61);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(255, 107, 53, 0.6);
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
        // Initialize map with dark tiles
        const map = L.map('map', {
            zoomControl: true,
            attributionControl: false
        }).setView([41.3851, 2.1734], 3);

        // Use dark CartoDB tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19
        }).addTo(map);

        // City coordinates
        const cityCoords = {
            'Barcelona': [41.3851, 2.1734],
            'London': [51.5074, -0.1278],
            'Los Angeles': [34.0522, -118.2437],
            'Miami': [25.7617, -80.1918]
        };

        // Add venue markers
        const venues = ${JSON.stringify(filteredVenues)};
        
        venues.forEach(venue => {
            const coords = cityCoords[venue.city];
            if (coords) {
                const marker = L.marker(coords, {
                    icon: L.divIcon({
                        className: 'venue-marker',
                        iconSize: [16, 16],
                        iconAnchor: [8, 8]
                    })
                }).addTo(map);
                
                marker.on('click', () => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'venueClick',
                        venueId: venue.id
                    }));
                });
            }
        });

        // Fit bounds if there are venues
        if (venues.length > 0) {
            const bounds = [];
            venues.forEach(v => {
                const coords = cityCoords[v.city];
                if (coords) bounds.push(coords);
            });
            if (bounds.length > 0) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    </script>
</body>
</html>
    `;

    const handleWebViewMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'venueClick') {
                const venue = MOCK_VENUES.find(v => v.id === data.venueId);
                if (venue) {
                    handleVenuePress(venue);
                }
            }
        } catch (e) {
            console.error('Error parsing WebView message:', e);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>NITEWAYS</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search venues, clubs, events..."
                    placeholderTextColor="#6B7280"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <Icon name="close-circle" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Category Filter Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                {categoryFilters.map(filter => (
                    <TouchableOpacity
                        key={filter.id}
                        style={[
                            styles.filterChip,
                            selectedCategory === filter.id && styles.filterChipActive,
                        ]}
                        onPress={() => setSelectedCategory(filter.id)}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                selectedCategory === filter.id && styles.filterChipTextActive,
                            ]}
                        >
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Interactive Map - Full Screen */}
            <View style={styles.mapContainer}>
                <WebView
                    ref={webViewRef}
                    source={{ html: mapHTML }}
                    style={styles.webview}
                    onMessage={handleWebViewMessage}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    javaScriptEnabled={true}
                />
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
    header: {
        paddingTop: 48,
        paddingBottom: 12,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#374151',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
        paddingVertical: 12,
    },
    filterContainer: {
        maxHeight: 50,
        marginBottom: 12,
    },
    filterContent: {
        paddingHorizontal: 16,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1F2937',
        borderWidth: 1,
        borderColor: '#374151',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#FBBF24',
        borderColor: '#FBBF24',
    },
    filterChipText: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '500',
    },
    filterChipTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    mapContainer: {
        flex: 1,
    },
    webview: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    venueCount: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    venueCountText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    venueList: {
        flex: 1,
        paddingHorizontal: 16,
        marginBottom: 70,
    },
    venueCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    markerIndicator: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    markerDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#FF6B35',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
    },
    venueInfo: {
        flex: 1,
    },
    venueHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    venueName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    venuePrice: {
        color: '#9CA3AF',
        fontSize: 13,
        marginLeft: 8,
    },
    venueMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    venueCity: {
        color: '#9CA3AF',
        fontSize: 12,
        marginLeft: 4,
    },
    venueDot: {
        color: '#4B5563',
        marginHorizontal: 6,
        fontSize: 12,
    },
    venueCategory: {
        color: '#9CA3AF',
        fontSize: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(251, 191, 36, 0.2)',
    },
    tagText: {
        color: '#FBBF24',
        fontSize: 10,
        fontWeight: '500',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#0a0a0a',
        borderTopWidth: 1,
        borderTopColor: '#1F2937',
        paddingBottom: 8,
        paddingTop: 8,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 8,
    },
    navItemActive: {},
    navText: {
        color: '#9CA3AF',
        fontSize: 11,
        marginTop: 4,
    },
    navTextActive: {
        color: '#FBBF24',
        fontWeight: '600',
    },
});

export default InteractiveMapScreen;
