import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Nightclub } from '../types';

const { width, height } = Dimensions.get('window');

interface EnhancedMapScreenProps {
    navigation: any;
}

//Mock club data from MainScreen
const MOCK_VENUES: Nightclub[] = [
    // Barcelona
    {
        id: 1,
        name: 'Pacha Barcelona',
        description: 'Iconic nightclub with world-class DJs',
        address: 'Av. del Paral·lel, 186',
        city: 'Barcelona',
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['House', 'Electronic', 'International DJs'],
    },
    {
        id: 2,
        name: 'Razzmatazz',
        description: 'Multi-room superclub with 5 different spaces',
        address: 'Carrer dels Almogàvers, 122',
        city: 'Barcelona',
        imageUrl: 'https://images.unsplash.com/photo-1571266028243-d220c6b1e5d9?w=800&q=80',
        category: 'Nightclub',
        priceLevel: '$$',
        tags: ['Indie', 'Rock', 'Techno'],
    },
    {
        id: 3,
        name: 'Opium Barcelona',
        description: 'Beachfront club with stunning Mediterranean views',
        address: 'Passeig Marítim de la Barceloneta, 34',
        city: 'Barcelona',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
        category: 'Beach Club',
        priceLevel: '$$$$',
        tags: ['House', 'Reggaeton', 'VIP'],
    },
    // London
    {
        id: 5,
        name: 'Fabric',
        description: 'Legendary underground club in Farringdon',
        address: '77A Charterhouse St, Farringdon',
        city: 'London',
        imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
        category: 'Nightclub',
        priceLevel: '$$',
        tags: ['Techno', 'Drum & Bass', 'Underground'],
    },
    {
        id: 6,
        name: 'Ministry of Sound',
        description: 'Iconic club with world-famous sound system',
        address: '103 Gaunt St, Elephant and Castle',
        city: 'London',
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['House', 'Electronic', 'Legendary'],
    },
    // Los Angeles
    {
        id: 9,
        name: 'Academy LA',
        description: 'Hollywood nightclub with top-tier production',
        address: '1735 N Cahuenga Blvd, Hollywood',
        city: 'Los Angeles',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['EDM', 'Hip Hop', 'Celebrity'],
    },
    // Miami
    {
        id: 13,
        name: 'LIV Miami',
        description: 'Ultra-luxe nightclub at Fontainebleau',
        address: '4441 Collins Ave, Miami Beach',
        city: 'Miami',
        imageUrl: 'https://images.unsplash.com/photo-1570876050997-2fdefce21852?w=800&q=80',
        category: 'Nightclub',
        priceLevel: '$$$$',
        tags: ['Celebrity', 'EDM', 'VIP'],
    },
    {
        id: 14,
        name: 'E11EVEN Miami',
        description: '24/7 ultraclub with world-class entertainment',
        address: '29 NE 11th St, Downtown',
        city: 'Miami',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
        category: 'Nightclub',
        priceLevel: '$$$$',
        tags: ['24/7', 'Hip Hop', 'EDM'],
    },
];

type CategoryFilter = 'all' | 'Nightclub' | 'Beach Club' | 'events';

const categoryFilters: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'Nightclub', label: 'Nightclub' },
    { id: 'events', label: 'Events' },
];

const EnhancedMapScreen: React.FC<EnhancedMapScreenProps> = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
    const [selectedVenue, setSelectedVenue] = useState<Nightclub | null>(null);

    // Filter venues based on search and category
    const filteredVenues = useMemo(() => {
        let filtered = MOCK_VENUES;

        // Filter by category
        if (selectedCategory !== 'all' && selectedCategory !== 'events') {
            filtered = filtered.filter(v => v.category === selectedCategory);
        }

        // Filter by search query
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
                    <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
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

            {/* Map Area with Markers (Scrollable) */}
            <ScrollView
                style={styles.mapContainer}
                contentContainerStyle={styles.mapContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.mapPlaceholder}>
                    <Icon name="map-outline" size={80} color="#374151" />
                    <Text style={styles.mapPlaceholderText}>
                        Interactive map with {filteredVenues.length} venues
                    </Text>
                    <Text style={styles.mapPlaceholderSubtext}>
                        Touch and drag to explore
                    </Text>
                </View>

                {/* Venue List */}
                <View style={styles.venueListContainer}>
                    <Text style={styles.venueListTitle}>
                        {filteredVenues.length} {selectedCategory === 'all' ? 'Venues' : categoryFilters.find(f => f.id === selectedCategory)?.label}
                    </Text>

                    {filteredVenues.map(venue => (
                        <TouchableOpacity
                            key={venue.id}
                            style={styles.venueCard}
                            onPress={() => handleVenuePress(venue)}
                            activeOpacity={0.7}
                        >
                            {/* Marker Indicator */}
                            <View style={styles.venueMarker}>
                                <View style={styles.markerDot} />
                            </View>

                            {/* Venue Info */}
                            <View style={styles.venueInfo}>
                                <View style={styles.venueHeader}>
                                    <Text style={styles.venueName}>{venue.name}</Text>
                                    <Text style={styles.venuePrice}>{venue.priceLevel}</Text>
                                </View>
                                <View style={styles.venueMetaRow}>
                                    <Icon name="location-outline" size={12} color="#9CA3AF" />
                                    <Text style={styles.venueCity}>{venue.city}</Text>
                                    <Text style={styles.venueDot}>•</Text>
                                    <Text style={styles.venueCategory}>{venue.category}</Text>
                                </View>
                                {venue.tags && venue.tags.length > 0 && (
                                    <View style={styles.tagsRow}>
                                        {venue.tags.slice(0, 3).map((tag, index) => (
                                            <View key={index} style={styles.tag}>
                                                <Text style={styles.tagText}>{tag}</Text>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>

                            <Icon name="chevron-forward" size={20} color="#6B7280" />
                        </TouchableOpacity>
                    ))}

                    {filteredVenues.length === 0 && (
                        <View style={styles.emptyState}>
                            <Icon name="search-outline" size={48} color="#4B5563" />
                            <Text style={styles.emptyStateText}>No venues found</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Try adjusting your search or filters
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Main')}
                >
                    <Icon name="home-outline" size={24} color="#9CA3AF" />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Events')}
                >
                    <Icon name="calendar-outline" size={24} color="#9CA3AF" />
                    <Text style={styles.navText}>Events</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
                    <Icon name="map" size={24} color="#FBBF24" />
                    <Text style={[styles.navText, styles.navTextActive]}>Map</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Icon name="person-outline" size={24} color="#9CA3AF" />
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
    header: {
        paddingTop: 48,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: '#000',
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
    clearButton: {
        padding: 4,
    },
    filterContainer: {
        maxHeight: 50,
        marginBottom: 12,
    },
    filterContent: {
        paddingHorizontal: 16,
        gap: 8,
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
    mapContent: {
        paddingBottom: 80,
    },
    mapPlaceholder: {
        height: 250,
        backgroundColor: '#0a0a0a',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
    },
    mapPlaceholderText: {
        marginTop: 12,
        color: '#9CA3AF',
        fontSize: 15,
        fontWeight: '500',
    },
    mapPlaceholderSubtext: {
        marginTop: 4,
        color: '#6B7280',
        fontSize: 12,
    },
    venueListContainer: {
        padding: 16,
    },
    venueListTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
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
    venueMarker: {
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
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
    },
    emptyStateSubtext: {
        color: '#6B7280',
        fontSize: 13,
        marginTop: 4,
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
    navItemActive: {
        // Active state
    },
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

export default EnhancedMapScreen;
