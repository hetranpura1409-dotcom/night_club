import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, StatusBar, Image, Platform, Dimensions, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import VenueCard from '../components/VenueCard';
import BottomNav from '../components/BottomNav';
import { Nightclub } from '../types';
import { CitySelectorModal } from '../components/CitySelectorModal';
import { useNotifications } from '../context/NotificationContext';
import { useFavorites } from '../context/FavoritesContext';
import LiquidSearchBar from '../components/LiquidSearchBar';

// Mock Data (temporary until backend connection)
const MOCK_VENUES: Nightclub[] = [
    // Barcelona
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
        description: 'Multi-room superclub with 5 different spaces',
        address: 'Carrer dels Almogàvers, 122',
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
        description: 'Beachfront club with stunning Mediterranean views',
        address: 'Passeig Marítim de la Barceloneta, 34',
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
        id: 4,
        name: 'Shôko Barcelona',
        description: 'Asian-inspired club and restaurant by the beach',
        address: 'Pg. Marítim de la Barceloneta, 36',
        city: 'Barcelona',
        imageUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
            'https://images.unsplash.com/photo-1622396481328-9b1b78cdd9fd?w=800&q=80',
            'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['Electronic', 'Beach', 'Restaurant'],
    },

    // London
    {
        id: 5,
        name: 'Fabric',
        description: 'Legendary underground club in Farringdon',
        address: '77A Charterhouse St, Farringdon',
        city: 'London',
        imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
            'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80',
            'https://images.unsplash.com/photo-1545128485-c400e77d2758?w=800&q=80',
        ],
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
        galleryImages: [
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
            'https://images.unsplash.com/photo-1558470598-a5dda9640f6b?w=800&q=80',
            'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['House', 'Electronic', 'Legendary'],
    },
    {
        id: 7,
        name: 'Printworks',
        description: 'Massive venue in converted printing factory',
        address: 'Surrey Quays Rd, Canada Water',
        city: 'London',
        imageUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
            'https://images.unsplash.com/photo-1578326466982-b7b5c8c57564?w=800&q=80',
            'https://images.unsplash.com/photo-1627663249052-a5e18231268c?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['Techno', 'Industrial', 'Warehouse'],
    },
    {
        id: 8,
        name: 'The Nest',
        description: 'Intimate basement club in Dalston',
        address: '36 Stoke Newington Rd, Dalston',
        city: 'London',
        imageUrl: 'https://images.unsplash.com/photo-1571266028243-d220c6b1e5d9?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1571266028243-d220c6b1e5d9?w=800&q=80',
            'https://images.unsplash.com/photo-1582234057635-f09b2e77e231?w=800&q=80',
            'https://images.unsplash.com/photo-1588694086088-3486a457a151?w=800&q=80',
        ],
        category: 'Club',
        priceLevel: '$',
        tags: ['House', 'Garage', 'Underground'],
    },

    // Los Angeles
    {
        id: 9,
        name: 'Academy LA',
        description: 'Hollywood nightclub with top-tier production',
        address: '1735 N Cahuenga Blvd, Hollywood',
        city: 'Los Angeles',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
            'https://images.unsplash.com/photo-1518115598504-749e798729cc?w=800&q=80',
            'https://images.unsplash.com/photo-1506157786151-58418c772266?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['EDM', 'Hip Hop', 'Celebrity'],
    },
    {
        id: 10,
        name: 'Sound Nightclub',
        description: 'Premier nightclub with stunning visuals',
        address: '1642 N Las Palmas Ave, Hollywood',
        city: 'Los Angeles',
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
            'https://images.unsplash.com/photo-1509666537727-9154b6fae8ea?w=800&q=80',
            'https://images.unsplash.com/photo-1551000673-8a3b8d146903?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$$',
        tags: ['House', 'Techno', 'VIP'],
    },
    {
        id: 11,
        name: 'Exchange LA',
        description: 'Historic stock exchange turned mega club',
        address: '618 S Spring St, Downtown',
        city: 'Los Angeles',
        imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
            'https://images.unsplash.com/photo-1578554854359-994df2279e8b?w=800&q=80',
            'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['EDM', 'Multi-floor', 'Historic'],
    },
    {
        id: 12,
        name: 'Catch One',
        description: 'Iconic LGBTQ+ nightclub with rich history',
        address: '4067 W Pico Blvd, Mid-City',
        city: 'Los Angeles',
        imageUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
            'https://images.unsplash.com/photo-1570876050997-2fdefce21852?w=800&q=80',
            'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$',
        tags: ['House', 'LGBTQ+', 'Diverse'],
    },

    // Miami
    {
        id: 13,
        name: 'LIV Miami',
        description: 'Ultra-luxe nightclub at Fontainebleau',
        address: '4441 Collins Ave, Miami Beach',
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
    {
        id: 14,
        name: 'E11EVEN Miami',
        description: '24/7 ultraclub with world-class entertainment',
        address: '29 NE 11th St, Downtown',
        city: 'Miami',
        imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
            'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?w=800&q=80',
            'https://images.unsplash.com/photo-1551000673-8a3b8d146903?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$$',
        tags: ['24/7', 'Hip Hop', 'EDM'],
    },
    {
        id: 15,
        name: 'Story Miami',
        description: 'Multi-level nightclub with rooftop',
        address: '136 Collins Ave, South Beach',
        city: 'Miami',
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
            'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
            'https://images.unsplash.com/photo-1571266028243-d220c6b1e5d9?w=800&q=80',
        ],
        category: 'Nightclub',
        priceLevel: '$$$',
        tags: ['House', 'Rooftop', 'Beach'],
    },
    {
        id: 16,
        name: 'Treehouse Miami',
        description: 'Rooftop club with stunning city views',
        address: '1 Collins Ave, Rooftop',
        city: 'Miami',
        imageUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
        galleryImages: [
            'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=800&q=80',
            'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
            'https://images.unsplash.com/photo-1558470598-a5dda9640f6b?w=800&q=80',
        ],
        category: 'Rooftop Bar',
        priceLevel: '$$$',
        tags: ['Rooftop', 'Views', 'Cocktails'],
    },
];

const MainScreen = ({ navigation }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCitySelectorVisible, setIsCitySelectorVisible] = useState(false);
    const [selectedCityId, setSelectedCityId] = useState<string | undefined>(undefined);
    const { unreadCount } = useNotifications();
    const { toggleFavorite, isFavorite } = useFavorites();

    // Mock cities data - replace with actual API data
    const cities = [
        { id: '1', name: 'Barcelona', country: 'Spain' },
        { id: '2', name: 'London', country: 'United Kingdom' },
        { id: '3', name: 'Los Angeles', country: 'USA' },
        { id: '4', name: 'Miami', country: 'United States' },
    ];

    // City-specific background images
    const cityBackgrounds: { [key: string]: string } = {
        'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1200&q=80', // Barcelona skyline
        'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80', // London skyline
        'Los Angeles': 'https://images.unsplash.com/photo-1534190239940-9ba8944ea261?w=1200&q=80', // LA skyline
        'Miami': 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=1200&q=80', // Miami skyline
    };

    const selectedCity = cities.find(c => c.id === selectedCityId);
    const displayCityName = selectedCity ? selectedCity.name : 'Select City';
    const backgroundImage = selectedCity ? cityBackgrounds[selectedCity.name] : null;

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.citySelector}
                onPress={() => setIsCitySelectorVisible(true)}
            >
                <Text style={styles.cityText}>{displayCityName}</Text>
                <Icon name="chevron-down" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    console.log('🔔 Bell tapped!');
                    navigation.navigate('Notifications');
                }}
                style={{
                    padding: 8,
                }}
            >
                <View style={{ position: 'relative' }}>
                    <Icon name="notifications-outline" size={24} color="#fff" />
                    <View
                        pointerEvents="none"
                        style={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            backgroundColor: '#FBBF24',
                            borderRadius: 10,
                            minWidth: 18,
                            height: 18,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 4,
                            display: unreadCount > 0 ? 'flex' : 'none',
                        }}
                    >
                        <Text
                            style={{
                                color: '#000',
                                fontSize: 10,
                                fontWeight: 'bold',
                            }}
                        >
                            {unreadCount}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    const renderSearchBar = () => (
        <View style={styles.searchContainer}>
            <LiquidSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="What club are you looking for?"
            />
        </View>
    );

    const renderSection = (title: string, data: Nightclub[]) => (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <Text style={styles.sectionCount}>{data.length}</Text>
            </View>
            <FlatList
                horizontal
                data={data}
                renderItem={({ item }) => (
                    <VenueCard
                        venue={item}
                        onPress={() => navigation.navigate('VenueDetail', { club: item })}
                        onHeartPress={() => toggleFavorite(item)}
                        isFavorited={isFavorite(item.id)}
                        width={220}
                    />
                )}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.sectionList}
            />
        </View>
    );

    // Filter logic
    let filteredVenues = MOCK_VENUES;

    // Filter by selected city
    if (selectedCityId) {
        const cityName = cities.find(c => c.id === selectedCityId)?.name;
        if (cityName) {
            filteredVenues = filteredVenues.filter(v => v.city === cityName);
        }
    }

    // Filter by search query
    if (searchQuery) {
        filteredVenues = filteredVenues.filter(v =>
            v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            v.city.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    const nightclubs = filteredVenues.filter(v => v.category === 'Nightclub');

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Header with City Background Image */}
            {backgroundImage ? (
                <ImageBackground
                    source={{ uri: backgroundImage }}
                    style={styles.headerBackgroundContainer}
                    imageStyle={styles.headerBackgroundImage}
                >
                    <View style={[styles.headerOverlay, { paddingTop: 80 }]}>
                        {/* Fixed Header */}
                        {renderHeader()}

                        {/* Search Bar */}
                        {renderSearchBar()}
                    </View>
                </ImageBackground>
            ) : (
                <View style={styles.headerBackgroundContainerNoImage}>
                    <View style={styles.headerOverlay}>
                        {/* Fixed Header */}
                        {renderHeader()}

                        {/* Search Bar */}
                        {renderSearchBar()}
                    </View>
                </View>
            )}

            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {renderSection(`Popular in ${displayCityName} 🔥`, filteredVenues)}
                {renderSection(`Nightclubs in ${displayCityName} 🎭`, nightclubs)}

                {/* Add more sections as needed */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNav activeTab="Home" navigation={navigation} />

            {/* City Selector Modal */}
            <CitySelectorModal
                visible={isCitySelectorVisible}
                onClose={() => setIsCitySelectorVisible(false)}
                cities={cities}
                selectedCity={selectedCity}
                onCitySelect={setSelectedCityId}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Black background
    },
    headerBackgroundContainer: {
        overflow: 'hidden',
    },
    headerBackgroundContainerNoImage: {
        // Compact layout for All Cities (no background image)
    },
    headerBackgroundImage: {
        opacity: 0.55,
        resizeMode: 'cover',
    },
    headerOverlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        paddingBottom: 0,
    },
    scrollContent: {
        paddingTop: 16,
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'android' ? 20 : 60,
        marginBottom: 20,
    },
    citySelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cityText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        marginRight: 6,
    },
    notificationButton: {
        position: 'relative',
        padding: 4,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FBBF24', // Yellow/Gold
        borderRadius: 10,
        width: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 0,
    },
    searchBar: {
        backgroundColor: '#0F0F12',
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: '#262629',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        padding: 0, // Reset default padding
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionCount: {
        color: '#6B7280',
        fontSize: 12,
    },
    sectionList: {
        paddingHorizontal: 20,
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: '#000',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#1F2937',
        paddingBottom: 20, // For home indicator
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

export default MainScreen;
