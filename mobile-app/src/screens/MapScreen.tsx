import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Platform,
    Dimensions,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Nightclub } from '../types';

const { width, height } = Dimensions.get('window');

// Mock venues with global locations
const MOCK_VENUES: Nightclub[] = [
    {
        id: 1,
        name: 'LIV Miami',
        description: 'Famous nightclub in Miami',
        address: '4441 Collins Ave, Miami Beach, FL',
        city: 'Miami',
        imageUrl: 'https://images.unsplash.com/photo-1570876050997-2fdefce21852?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1570876050997-2fdefce21852?w=800&q=80',
            'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
            'https://images.unsplash.com/photo-1545128485-c400e77d2758?w=800&q=80',
            'https://images.unsplash.com/photo-1514525253440-b393452e8d03?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['House', 'Celebrity'],
    },
    {
        id: 2,
        name: 'Ministry of Sound',
        description: 'Iconic London club',
        address: 'London, United Kingdom',
        city: 'London',
        imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
            'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=800&q=80',
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$',
        tags: ['Electronic'],
    },
    {
        id: 3,
        name: 'Berghain',
        description: 'Techno temple',
        address: 'Berlin, Germany',
        city: 'Berlin',
        imageUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
            'https://images.unsplash.com/photo-1558470598-a5dda9640f6b?w=800&q=80',
            'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$',
        tags: ['Techno'],
    },
    {
        id: 4,
        name: 'Pacha Ibiza',
        description: 'Legendary venue',
        address: 'Ibiza, Spain',
        city: 'Ibiza',
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
            'https://images.unsplash.com/photo-1571266028243-d220c6b1e5d9?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$$',
        tags: ['EDM'],
    },
    {
        id: 5,
        name: 'Hï Ibiza',
        description: 'Ultra-modern superclub',
        address: 'Platja d\'en Bossa, Ibiza',
        city: 'Ibiza',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
            'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=800&q=80',
            'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$$',
        tags: ['EDM', 'House'],
    },
    {
        id: 6,
        name: 'Zouk Singapore',
        description: 'Asia\'s premier nightclub',
        address: 'Singapore',
        city: 'Singapore',
        imageUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
            'https://images.unsplash.com/photo-1570876050997-2fdefce21852?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['EDM', 'Hip Hop'],
    },
    {
        id: 7,
        name: 'Warung Beach Club',
        description: 'Brazilian paradise',
        address: 'Itajaí, Brazil',
        city: 'Brazil',
        imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
        ],
        category: 'Beach Club',
        priceLevel: '$$',
        tags: ['Techno', 'Beach'],
    },
    {
        id: 8,
        name: 'Output Brooklyn',
        description: 'Brooklyn\'s finest',
        address: 'Brooklyn, New York',
        city: 'New York',
        imageUrl: 'https://images.unsplash.com/photo-1570876050997-2fdefce21852?w=800&q=80',
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['Techno', 'House'],
    },
];

// Global marker positions (simulated world coordinates as percentages)
const MARKER_POSITIONS = [
    { id: 1, top: '48%', left: '21%', label: 'Miami' },             // Miami, Florida
    { id: 2, top: '30%', left: '49%', label: 'London' },            // London, UK
    { id: 3, top: '33%', left: '52%', label: 'Berlin' },            // Berlin, Germany
    { id: 4, top: '40%', left: '47%', label: 'Ibiza' },             // Ibiza, Spain
    { id: 5, top: '41%', left: '47.5%', label: 'Ibiza' },           // Ibiza (second venue)
    { id: 6, top: '45%', left: '75%', label: 'Singapore' },         // Singapore
    { id: 7, top: '62%', left: '30%', label: 'Brazil' },            // Brazil
    { id: 8, top: '42%', left: '23%', label: 'New York' },          // New York
];

// User location marker (Stockholm area)
const USER_LOCATION = { top: '28%', left: '54%', label: 'Stockholm' };

interface MapScreenProps {
    navigation: any;
}

const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedVenue, setSelectedVenue] = useState<Nightclub | null>(null);

    const categoryFilters = [
        { id: 'all', label: 'All' },
        { id: 'nightclub', label: 'Nightclub' },
        { id: 'events', label: 'Events' },
    ];

    return (
        <View style={styles.container}>
            {/* Full-screen Global Map Background */}
            <View style={styles.mapContainer}>
                {/* Simulated world map with continents */}
                <View style={styles.worldMapOverlay}>
                    {/* Add subtle grid lines */}
                    <View style={styles.gridLines}>
                        <View style={[styles.gridLine, { top: '25%' }]} />
                        <View style={[styles.gridLine, { top: '50%' }]} />
                        <View style={[styles.gridLine, { top: '75%' }]} />
                        <View style={[styles.gridLineVertical, { left: '25%' }]} />
                        <View style={[styles.gridLineVertical, { left: '50%' }]} />
                        <View style={[styles.gridLineVertical, { left: '75%' }]} />
                    </View>

                    {/* Geographic labels */}
                    <Text style={[styles.geoLabel, { top: '15%', left: '20%' }]}>North America</Text>
                    <Text style={[styles.geoLabel, { top: '25%', left: '50%' }]}>Europe</Text>
                    <Text style={[styles.geoLabel, { top: '55%', left: '50%' }]}>Africa</Text>
                    <Text style={[styles.geoLabel, { top: '60%', left: '25%' }]}>South America</Text>
                    <Text style={[styles.geoLabel, { top: '35%', left: '70%' }]}>Asia</Text>
                </View>

                {/* Venue markers */}
                {MARKER_POSITIONS.map(pos => {
                    const venue = MOCK_VENUES.find(v => v.id === pos.id);
                    if (!venue) return null;

                    return (
                        <TouchableOpacity
                            key={pos.id}
                            style={[styles.marker, { top: pos.top, left: pos.left }]}
                            onPress={() => setSelectedVenue(venue)}
                        >
                            <View style={styles.markerWrapper}>
                                <View style={styles.markerPulse} />
                                <View style={styles.markerDot} />
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {/* User location marker (yellow/gold) */}
                <View style={[styles.marker, { top: USER_LOCATION.top, left: USER_LOCATION.left }]}>
                    <View style={styles.markerWrapper}>
                        <View style={[styles.markerPulse, styles.userPulse]} />
                        <View style={[styles.markerDot, styles.userMarker]} />
                    </View>
                </View>
            </View>

            {/* Top overlay with search and filters */}
            <View style={styles.topOverlay}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Icon name="search" size={18} color="#9CA3AF" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search venues, clubs, events..."
                            placeholderTextColor="#6B7280"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Icon name="close-circle" size={18} color="#6B7280" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Category Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterContainer}
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
                                    styles.filterText,
                                    selectedCategory === filter.id && styles.filterTextActive,
                                ]}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Selected Venue Preview Card */}
            {selectedVenue && (
                <View style={styles.venuePreview}>
                    <TouchableOpacity
                        style={styles.closePreview}
                        onPress={() => setSelectedVenue(null)}
                    >
                        <Icon name="close" size={16} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.previewContent}>
                        <View style={styles.previewHeader}>
                            <Text style={styles.previewCategory}>{selectedVenue.category}</Text>
                            {selectedVenue.priceLevel && (
                                <Text style={styles.previewPrice}>{selectedVenue.priceLevel}</Text>
                            )}
                        </View>

                        <Text style={styles.previewName}>{selectedVenue.name}</Text>

                        <View style={styles.previewLocation}>
                            <Icon name="location" size={12} color="#9CA3AF" />
                            <Text style={styles.previewCity}>{selectedVenue.city}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.viewDetailsButton}
                            onPress={() => {
                                navigation.navigate('ClubEvents', { club: selectedVenue });
                                setSelectedVenue(null);
                            }}
                        >
                            <Text style={styles.viewDetailsText}>View Details</Text>
                            <Icon name="chevron-forward" size={14} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Main')}
                >
                    <View style={styles.navIconContainer}>
                        <Icon name="home" size={26} color="#9CA3AF" />
                    </View>
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <View style={styles.navIconContainer}>
                        <Icon name="calendar" size={26} color="#9CA3AF" />
                    </View>
                    <Text style={styles.navText}>Events</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem}>
                    <View style={styles.navIconContainer}>
                        <Icon name="map" size={26} color="#FBBF24" />
                    </View>
                    <Text style={[styles.navText, styles.activeNavText]}>Map</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <View style={styles.navIconContainer}>
                        <Icon name="person" size={26} color="#9CA3AF" />
                    </View>
                    <Text style={styles.navText}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    mapContainer: {
        flex: 1,
        backgroundColor: '#0a0a0a',
        position: 'relative',
    },
    worldMapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#0d0d0d',
        // Add subtle radial gradient effect
    },
    gridLines: {
        ...StyleSheet.absoluteFillObject,
    },
    gridLine: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    gridLineVertical: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    geoLabel: {
        position: 'absolute',
        color: 'rgba(156, 163, 175, 0.25)',
        fontSize: 12,
        fontWeight: '400',
        letterSpacing: 1.5,
    },
    topOverlay: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    searchBar: {
        backgroundColor: 'rgba(24, 24, 27, 0.98)',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
    },
    filterContainer: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 22,
        paddingVertical: 14,
        borderRadius: 28,
        backgroundColor: 'rgba(24, 24, 27, 0.95)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    filterChipActive: {
        backgroundColor: '#FF6B35',
        borderColor: '#FF6B35',
        shadowColor: '#FF6B35',
        shadowOpacity: 0.4,
    },
    filterText: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: '600',
    },
    marker: {
        position: 'absolute',
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -24,
        marginTop: -24,
    },
    markerWrapper: {
        position: 'relative',
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    markerPulse: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 107, 53, 0.3)',
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
        shadowOpacity: 0.9,
        shadowRadius: 10,
        elevation: 12,
    },
    userMarker: {
        backgroundColor: '#FBBF24',
        shadowColor: '#FBBF24',
    },
    userPulse: {
        backgroundColor: 'rgba(251, 191, 36, 0.25)',
    },
    venuePreview: {
        position: 'absolute',
        bottom: 90,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(24, 24, 27, 0.98)',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 53, 0.15)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 15,
    },
    closePreview: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContent: {
        paddingRight: 20,
    },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    previewCategory: {
        color: '#9CA3AF',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    previewPrice: {
        color: '#FBBF24',
        fontSize: 12,
        fontWeight: '600',
    },
    previewName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    previewLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },
    previewCity: {
        color: '#9CA3AF',
        fontSize: 13,
    },
    viewDetailsButton: {
        backgroundColor: '#FBBF24',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#FBBF24',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    viewDetailsText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#1F2937',
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navIconContainer: {
        marginBottom: 2,
    },
    navText: {
        fontSize: 10,
        marginTop: 4,
        color: '#9CA3AF',
    },
    activeNavText: {
        color: '#FBBF24',
    },
});

export default MapScreen;
