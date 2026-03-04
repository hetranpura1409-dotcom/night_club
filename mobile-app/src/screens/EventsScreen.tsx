import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    ImageBackground,
    Dimensions,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CitySelectorModal } from '../components/CitySelectorModal';
import { useNotifications } from '../context/NotificationContext';
import BottomNav from '../components/BottomNav';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STATUS_BAR_H = StatusBar.currentHeight ?? 0;

// ── City hero images ──────────────────────────────────────────────────────────
const CITY_BACKGROUNDS: Record<string, string> = {
    Barcelona: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&auto=format&fit=crop',
    London: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop',
    'Los Angeles': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&auto=format&fit=crop',
    Miami: 'https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800&auto=format&fit=crop',
    default: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop',
};

// ── Genre filter options ──────────────────────────────────────────────────────
const GENRES = ['All', 'EDM', 'Hip Hop', 'Reggaeton', 'Techno', 'House'];

// ── Mock events ───────────────────────────────────────────────────────────────
const MOCK_EVENTS = [
    {
        id: '1',
        name: 'Saturday Night Fever',
        venue: 'Pacha Barcelona',
        city: 'Barcelona',
        date: '2026-02-14',
        time: '23:00 - 06:00',
        category: 'EDM',
        price: 25,
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop',
    },
    {
        id: '2',
        name: 'Reggaeton Nights',
        venue: 'Opium Barcelona',
        city: 'Barcelona',
        date: '2026-02-15',
        time: '23:30 - 05:00',
        category: 'Reggaeton',
        price: 20,
        image: 'https://exoduslasvegas.com/wp-content/uploads/2021/06/4.-image-2.jpg',
    },
    {
        id: '4',
        name: 'Fabric All-Nighter',
        venue: 'Fabric',
        city: 'London',
        date: '2026-02-14',
        time: '22:00 - 08:00',
        category: 'Techno',
        price: 20,
        image: 'https://i.pinimg.com/originals/a3/24/6f/a3246f2e863d7086077c3d969b5810b7.jpg',
    },
    {
        id: '5',
        name: 'House Nation',
        venue: 'Ministry of Sound',
        city: 'London',
        date: '2026-02-15',
        time: '22:00 - 06:00',
        category: 'House',
        price: 25,
        image: 'https://tse3.mm.bing.net/th/id/OIP.kWCpsVGRd3kzV2l77gFTEQHaEv?pid=ImgDet&w=194&h=123&c=7&dpr=1.7&o=7&rm=3',
    },
    {
        id: '6',
        name: 'Hollywood Takeover',
        venue: 'Academy LA',
        city: 'Los Angeles',
        date: '2026-02-14',
        time: '22:00 - 04:00',
        category: 'EDM',
        price: 35,
        image: 'https://www.caesars.com/content/scaffold_pages/generic/caesars/clv/en/omnia-nightclub/_jcr_content/cards/card/image.stdimg.hd.xl.jpg/1662499996799.jpg',
    },
    {
        id: '7',
        name: 'Downtown Vibes',
        venue: 'Exchange LA',
        city: 'Los Angeles',
        date: '2026-02-15',
        time: '21:00 - 03:00',
        category: 'House',
        price: 30,
        image: 'https://taogroup.com/wp-content/uploads/2022/07/Omnia_SteveAoki_SammyDean_07.01.22.Highres-75-970x647.jpg',
    },
    {
        id: '8',
        name: 'Miami Vice Night',
        venue: 'LIV Miami',
        city: 'Miami',
        date: '2026-02-14',
        time: '23:00 - 06:00',
        category: 'Hip Hop',
        price: 50,
        image: 'https://www.travelandleisure.com/thmb/oA9JDMII-uWfTxxKx1ovFtPHq1g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/TAL-liv-nightclub-fontainebleau-las-vegas-BEACHCLUBLV0325-cb3801028ed74632a59e723c4336299f.jpg',
    },
    {
        id: '9',
        name: 'Ultra White Party',
        venue: 'E11EVEN Miami',
        city: 'Miami',
        date: '2026-02-15',
        time: '00:00 - 08:00',
        category: 'EDM',
        price: 45,
        image: 'https://clubbookers.com/wp-content/uploads/2023/01/2-7.jpg',
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
};

// ── Component ─────────────────────────────────────────────────────────────────
const EventsScreen = ({ navigation }: any) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeGenre, setActiveGenre] = useState('All');
    const [isCitySelectorVisible, setIsCitySelectorVisible] = useState(false);
    const [selectedCityId, setSelectedCityId] = useState<string | undefined>(undefined);
    const { unreadCount } = useNotifications();

    const cities = [
        { id: '1', name: 'Barcelona', country: 'Spain' },
        { id: '2', name: 'London', country: 'United Kingdom' },
        { id: '3', name: 'Los Angeles', country: 'USA' },
        { id: '4', name: 'Miami', country: 'United States' },
    ];

    const selectedCity = cities.find(c => c.id === selectedCityId);
    const displayCityName = selectedCity ? selectedCity.name : 'All Cities';
    const heroBg = CITY_BACKGROUNDS[displayCityName] || CITY_BACKGROUNDS.default;

    const filteredEvents = MOCK_EVENTS.filter(event => {
        const matchesCity = !selectedCity || event.city === selectedCity.name;
        const matchesGenre = activeGenre === 'All' || event.category.toLowerCase().includes(activeGenre.toLowerCase());
        const matchesSearch =
            event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCity && matchesGenre && matchesSearch;
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>

                {/* ── City Hero Banner ─────────────────────────────────────── */}
                <ImageBackground
                    source={{ uri: heroBg }}
                    style={styles.hero}
                    resizeMode="cover"
                >
                    {/* Bottom-to-top gradient overlay */}
                    <View style={styles.heroOverlay}>
                        {/* Top bar */}
                        <View style={styles.topBar}>
                            {/* City selector */}
                            <TouchableOpacity
                                style={styles.citySelector}
                                onPress={() => setIsCitySelectorVisible(true)}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Text style={styles.cityName}>{displayCityName}</Text>
                                <Icon name="chevron-down" size={18} color="#fff" />
                            </TouchableOpacity>

                            {/* Bell */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Notifications')}
                                style={styles.bellBtn}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Icon name="notifications-outline" size={24} color="#fff" />
                                {unreadCount > 0 && (
                                    <View style={styles.badge}>
                                        <Text style={styles.badgeText}>{unreadCount}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Country subtitle */}
                        {selectedCity && (
                            <Text style={styles.countryText}>{selectedCity.country}</Text>
                        )}
                    </View>
                </ImageBackground>

                {/* ── Search + Filters ─────────────────────────────────────── */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Icon name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search events..."
                            placeholderTextColor="#6B7280"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* ── Genre Chips ──────────────────────────────────────────── */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.genreRow}
                >
                    {GENRES.map(genre => (
                        <TouchableOpacity
                            key={genre}
                            style={[styles.chip, activeGenre === genre && styles.chipActive]}
                            onPress={() => setActiveGenre(genre)}
                        >
                            <Text style={[styles.chipText, activeGenre === genre && styles.chipTextActive]}>
                                {genre}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* ── Section Header ───────────────────────────────────────── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>All Upcoming Events 🎉</Text>
                </View>

                {/* ── Event Cards ──────────────────────────────────────────── */}
                {filteredEvents.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="calendar-outline" size={64} color="#4B5563" />
                        <Text style={styles.emptyTitle}>No upcoming events</Text>
                        <Text style={styles.emptySubtitle}>Try a different city or genre</Text>
                    </View>
                ) : (
                    <View style={styles.cardList}>
                        {filteredEvents.map(event => (
                            <TouchableOpacity
                                key={event.id}
                                activeOpacity={0.85}
                                onPress={() => navigation.navigate('EventDetail', { event })}
                            >
                                <ImageBackground
                                    source={{ uri: event.image }}
                                    style={styles.card}
                                    imageStyle={styles.cardImg}
                                    resizeMode="cover"
                                >
                                    <View style={styles.cardOverlay}>
                                        {/* Top row: date chip + genre chip */}
                                        <View style={styles.cardTopRow}>
                                            <View style={styles.datePill}>
                                                <Text style={styles.datePillText}>{formatDate(event.date)}</Text>
                                            </View>
                                            <View style={styles.genrePill}>
                                                <Icon name="headset-outline" size={11} color="#fff" style={{ marginRight: 4 }} />
                                                <Text style={styles.genrePillText}>{event.category}</Text>
                                            </View>
                                        </View>

                                        {/* Bottom: event name + venue + time */}
                                        <View style={styles.cardBottom}>
                                            <Text style={styles.cardName}>{event.name}</Text>
                                            <Text style={styles.cardVenue}>
                                                {event.venue}{'  ·  '}{event.time}
                                            </Text>
                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={{ height: 110 }} />
            </ScrollView>

            {/* ── City Selector Modal ───────────────────────────────────────── */}
            <CitySelectorModal
                visible={isCitySelectorVisible}
                onClose={() => setIsCitySelectorVisible(false)}
                cities={cities}
                selectedCity={selectedCity}
                onCitySelect={setSelectedCityId}
            />

            {/* ── Bottom Navigation ─────────────────────────────────────────── */}
            <BottomNav activeTab="Events" navigation={navigation} />
        </View>
    );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A0A' },
    scroll: { flex: 1 },

    // Hero
    hero: {
        width: SCREEN_WIDTH,
        height: Platform.OS === 'ios' ? 220 : 200,
    },
    heroOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 16,
        paddingHorizontal: 16,
        // dark gradient effect using layered opacity
        backgroundColor: 'rgba(0,0,0,0.45)',
        paddingTop: Platform.OS === 'ios' ? 54 : STATUS_BAR_H + 10,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'auto' as any,
    },
    citySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    cityName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: 0.3,
        textShadowColor: 'rgba(0,0,0,0.8)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 6,
    },
    countryText: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 13,
        fontWeight: '400',
        marginTop: 2,
    },
    bellBtn: {
        padding: 4,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FBBF24',
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: { color: '#000', fontSize: 9, fontWeight: 'bold' },

    // Search
    searchSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 46,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 15,
    },

    // Genre chips
    genreRow: {
        paddingHorizontal: 16,
        paddingBottom: 4,
        gap: 8,
    },
    chip: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#2E2E2E',
    },
    chipActive: {
        backgroundColor: '#FBBF24',
        borderColor: '#FBBF24',
    },
    chipText: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '500',
    },
    chipTextActive: {
        color: '#000',
        fontWeight: '700',
    },

    // Section header
    sectionHeader: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 12,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 0.2,
    },

    // Cards
    cardList: {
        paddingHorizontal: 16,
        gap: 14,
    },
    card: {
        width: '100%',
        height: 190,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 2,
    },
    cardImg: {
        borderRadius: 16,
    },
    cardOverlay: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 14,
        // bottom fade
        backgroundColor: 'rgba(0,0,0,0.15)',
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    datePill: {
        backgroundColor: 'rgba(0,0,0,0.55)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    datePillText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    genrePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.55)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    genrePillText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    cardBottom: {
        // dark bottom gradient area
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        padding: 10,
    },
    cardName: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 3,
    },
    cardVenue: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 13,
    },

    // Empty state
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 14,
    },
    emptySubtitle: {
        color: '#6B7280',
        fontSize: 14,
        marginTop: 6,
    },

    // Bottom nav
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#0A0A0A',
        borderTopWidth: 1,
        borderTopColor: '#1F1F1F',
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        paddingTop: 10,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        gap: 3,
    },
    navText: {
        color: '#6B7280',
        fontSize: 11,
    },
});

export default EventsScreen;
