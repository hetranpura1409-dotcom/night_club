import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    Dimensions,
    Linking,
    Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { Nightclub, User } from '../types';
import TableBookingFlow from '../components/TableBookingFlow';
import GuestListFlow from '../components/GuestListFlow';
import { authService } from '../services/auth';
import Button from '../components/Button';
import CalendarPicker from '../components/CalendarPicker';
import TableLayoutMap from '../components/TableLayoutMap';
import { getTableLayout, TableItem } from '../data/tableLayouts';

const { width } = Dimensions.get('window');

export interface VenueDetailScreenProps {
    navigation: any;
    route: {
        params: {
            club: Nightclub;
        };
    };
}

type TabType = 'tables' | 'tickets' | 'guestlist';

const VenueDetailScreen: React.FC<VenueDetailScreenProps> = ({ navigation, route }) => {
    const { club } = route.params;
    const [activeTab, setActiveTab] = useState<TabType>('tickets');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showGuestListModal, setShowGuestListModal] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);

    const tableLayout = getTableLayout(club.id);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const storedUser = await authService.getStoredUser();
        setUser(storedUser);
    };

    // Reliable fallback images (picsum always works)
    const FALLBACK_IMAGES = [
        'https://picsum.photos/seed/club1/800/600',
        'https://picsum.photos/seed/club2/800/600',
        'https://picsum.photos/seed/club3/800/600',
    ];

    const galleryImages = (() => {
        if (club.galleryImages && club.galleryImages.length > 0) {
            return club.galleryImages.filter((img: string) => img && img.length > 0);
        }
        const primary = club.imageUrl;
        if (primary && primary.length > 0 && !primary.includes('example.com')) {
            return [primary, FALLBACK_IMAGES[1], FALLBACK_IMAGES[2]];
        }
        return FALLBACK_IMAGES;
    })();

    const clubDetails = {
        capacity: '25+',
        hours: '23:00 - 05:00',
        genre: club.tags?.join(' & ') || 'Electronic, House',
        description:
            club.description ||
            `${club.name}, arguably one of the most renowned nightlife destinations, is perfectly located in the heart of the city within an iconic building. This hotspot is a key destination for both the local elite and visitors, celebrated for its vibrant atmosphere and diverse musical offerings. The club features world-class DJs and a variety of music genres, catering to a wide range of musical tastes. Known for its exclusive nights, ${club.name} offers a dynamic nightlife experience, making it a cultural epicenter and a go-to place for unforgettable evenings.`,
        address: club.address || 'Address not available',
        instagram: club.name.toLowerCase().replace(/\s+/g, ''),
    };

    // Format selected date
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const dateLabel = isToday
        ? `Today, ${selectedDate.getDate()} ${months[selectedDate.getMonth()]}`
        : `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

    const handleLocationPress = () => {
        if (club.address) {
            const url = `https://maps.google.com/?q=${encodeURIComponent(club.address)}`;
            Linking.openURL(url);
        }
    };

    const handleInstagramPress = () => {
        const url = `https://instagram.com/${clubDetails.instagram}`;
        Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Booking Modal */}
            <TableBookingFlow
                visible={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                club={club}
                user={user}
                selectedTable={selectedTable}
            />

            {/* Guest List Modal */}
            <GuestListFlow
                visible={showGuestListModal}
                onClose={() => setShowGuestListModal(false)}
                club={club}
                user={user}
            />

            {/* Calendar Picker Modal */}
            <CalendarPicker
                visible={showCalendar}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onClose={() => setShowCalendar(false)}
            />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Hero Image with NITEWAYS Header */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: galleryImages[currentImageIndex] }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />

                    {/* NITEWAYS Header Overlay */}
                    <View style={styles.headerOverlay}>
                        <Text style={styles.brandTitle}>NITEWAYS</Text>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        >
                            <Icon name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Gallery Dot Indicators */}
                    {galleryImages.length > 1 && (
                        <View style={styles.indicators}>
                            {galleryImages.map((_: string, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setCurrentImageIndex(index)}
                                >
                                    <View
                                        style={[
                                            styles.indicator,
                                            currentImageIndex === index && styles.activeIndicator,
                                        ]}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Venue Info Section */}
                <View style={styles.infoSection}>
                    {/* Category + Capacity Row */}
                    <View style={styles.headerRow}>
                        <View style={styles.categoryBadge}>
                            <View style={styles.greenDot} />
                            <Text style={styles.categoryText}>{club.category || 'Nightclub'}</Text>
                        </View>
                        <View style={styles.capacityBadge}>
                            <Icon name="people-outline" size={14} color="#9CA3AF" />
                            <Text style={styles.capacityText}>{clubDetails.capacity}</Text>
                        </View>
                    </View>

                    {/* Venue Name */}
                    <Text style={styles.venueName}>{club.name}</Text>

                    {/* Price + Genre + Hours */}
                    <View style={styles.metaRow}>
                        <Text style={styles.metaText}>{club.priceLevel || '$$'}</Text>
                        <View style={styles.metaItem}>
                            <Icon name="musical-notes" size={14} color="#9CA3AF" />
                            <Text style={styles.metaText}>{clubDetails.genre}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Icon name="time-outline" size={14} color="#9CA3AF" />
                            <Text style={styles.metaText}>{clubDetails.hours}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>{clubDetails.description}</Text>

                    {/* Action Buttons - 2x2 Grid */}
                    <View style={styles.actionGrid}>
                        <TouchableOpacity style={styles.actionButtonOutlined} onPress={handleLocationPress}>
                            <Icon name="location-outline" size={18} color="#fff" />
                            <Text style={styles.actionButtonText}>Location</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButtonOutlined}>
                            <Icon name="book-outline" size={18} color="#fff" />
                            <Text style={styles.actionButtonText}>Menu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButtonSpotify}>
                            <Icon name="musical-note-outline" size={18} color="#fff" />
                            <Text style={styles.actionButtonTextSpotify}>Listen on Spotify</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButtonOutlined} onPress={handleInstagramPress}>
                            <Icon name="logo-instagram" size={18} color="#fff" />
                            <Text style={styles.actionButtonText}>Instagram</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Date Picker Row */}
                    <TouchableOpacity style={styles.datePickerRow} onPress={() => setShowCalendar(true)} activeOpacity={0.7}>
                        <View style={styles.dateLeft}>
                            <Icon name="calendar-outline" size={18} color="#4ADE80" />
                            <Text style={styles.dateText}>{dateLabel}</Text>
                        </View>
                        <Icon name="calendar-outline" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'tables' && styles.activeTab]}
                            onPress={() => setActiveTab('tables')}
                        >
                            <Icon
                                name="people-outline"
                                size={16}
                                color={activeTab === 'tables' ? '#fff' : '#9CA3AF'}
                            />
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'tables' && styles.activeTabText,
                                ]}
                            >
                                Tables
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'tickets' && styles.activeTab]}
                            onPress={() => setActiveTab('tickets')}
                        >
                            <Icon
                                name="ticket-outline"
                                size={16}
                                color={activeTab === 'tickets' ? '#fff' : '#9CA3AF'}
                            />
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'tickets' && styles.activeTabText,
                                ]}
                            >
                                Tickets
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'guestlist' && styles.activeTab]}
                            onPress={() => setActiveTab('guestlist')}
                        >
                            <Icon
                                name="list-outline"
                                size={16}
                                color={activeTab === 'guestlist' ? '#fff' : '#9CA3AF'}
                            />
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === 'guestlist' && styles.activeTabText,
                                ]}
                            >
                                Guest List
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tab Content */}
                    <View style={styles.tabContent}>
                        {activeTab === 'tables' && (
                            <View>
                                <TableLayoutMap
                                    layout={tableLayout}
                                    selectedTableId={selectedTable?.id || null}
                                    onSelectTable={(table) => setSelectedTable(table)}
                                />
                                {selectedTable && (
                                    <View style={styles.selectedTableCard}>
                                        <View style={styles.selectedCardRow}>
                                            <View>
                                                <Text style={styles.selectedCardName}>{selectedTable.label}</Text>
                                                <Text style={styles.selectedCardCapacity}>
                                                    Capacity: {selectedTable.capacity} guests
                                                </Text>
                                            </View>
                                            <View style={styles.selectedCardPriceBlock}>
                                                <Text style={styles.selectedCardPrice}>
                                                    {selectedTable.currency}{selectedTable.price}
                                                </Text>
                                                <Text style={styles.selectedCardMinSpend}>Min. spend</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={styles.bookTableButton}
                                            activeOpacity={0.8}
                                            onPress={() => setShowBookingModal(true)}
                                        >
                                            <Text style={styles.bookTableButtonText}>Book Table</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )}

                        {activeTab === 'tickets' && (
                            <View style={styles.emptyTab}>
                                <Icon name="ticket-outline" size={48} color="#374151" />
                                <Text style={styles.emptyTitle}>No Tickets Available</Text>
                                <Text style={styles.emptyText}>Check back closer to the event date.</Text>
                            </View>
                        )}

                        {activeTab === 'guestlist' && (
                            <View>
                                <View style={styles.tabHeader}>
                                    <Text style={styles.tabTitle}>Exclusive Guest List</Text>
                                    <Text style={styles.tabSubtitle}>Get on the list for streamlined entry</Text>
                                </View>
                                <Button title="Join Guest List" onPress={() => setShowGuestListModal(true)} />
                                <View style={styles.featureList}>
                                    <View style={styles.featureItem}>
                                        <Icon name="checkmark-circle" size={16} color="#4ADE80" />
                                        <Text style={styles.featureText}>Reduced Entry Fee</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Icon name="checkmark-circle" size={16} color="#4ADE80" />
                                        <Text style={styles.featureText}>Valid until 11:30 PM</Text>
                                    </View>
                                    <View style={styles.featureItem}>
                                        <Icon name="checkmark-circle" size={16} color="#4ADE80" />
                                        <Text style={styles.featureText}>Limited Availability</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A0A',
    },
    scrollView: {
        flex: 1,
    },
    // Hero
    heroContainer: {
        height: 260,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1A1A2E',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'ios' ? 56 : (StatusBar.currentHeight || 0) + 12,
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
    brandTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 1,
    },
    indicators: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    activeIndicator: {
        backgroundColor: '#fff',
        width: 24,
    },
    // Info Section
    infoSection: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    categoryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    greenDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4ADE80',
    },
    categoryText: {
        color: '#D1D5DB',
        fontSize: 14,
        fontWeight: '500',
    },
    capacityBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#374151',
    },
    capacityText: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '600',
    },
    venueName: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 20,
    },
    metaText: {
        color: '#9CA3AF',
        fontSize: 13,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    description: {
        color: '#D1D5DB',
        fontSize: 14,
        lineHeight: 22,
        marginBottom: 24,
    },
    // Action Buttons
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    actionButtonOutlined: {
        flex: 1,
        minWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#374151',
    },
    actionButtonSpotify: {
        flex: 1,
        minWidth: '45%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: '#1DB954',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },
    actionButtonTextSpotify: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    // Date Picker
    datePickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1F2937',
        backgroundColor: '#111318',
        marginBottom: 20,
    },
    dateLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    dateText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#FBBF24',
    },
    tabText: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '600',
    },
    tabContent: {
        minHeight: 200,
        paddingBottom: 40,
    },
    // Tab Content
    tabHeader: {
        marginBottom: 20,
    },
    tabTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    tabSubtitle: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    featureList: {
        marginTop: 20,
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    featureText: {
        color: '#D1D5DB',
        fontSize: 14,
    },
    emptyTab: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: '#111827',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 4,
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    selectedTableCard: {
        backgroundColor: '#1A1D24',
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
    },
    selectedCardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    selectedCardName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    selectedCardCapacity: {
        color: '#9CA3AF',
        fontSize: 13,
        marginTop: 4,
    },
    selectedCardPriceBlock: {
        alignItems: 'flex-end',
    },
    selectedCardPrice: {
        color: '#FBBF24',
        fontSize: 22,
        fontWeight: '800',
    },
    selectedCardMinSpend: {
        color: '#9CA3AF',
        fontSize: 12,
        marginTop: 2,
    },
    bookTableButton: {
        backgroundColor: '#FBBF24',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    bookTableButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default VenueDetailScreen;
