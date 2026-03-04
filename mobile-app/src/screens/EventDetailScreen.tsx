import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    StatusBar,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface EventDetailScreenProps {
    route: any;
    navigation: any;
}

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({ route, navigation }) => {
    const { event } = route.params;
    const [activeTab, setActiveTab] = useState<'tables' | 'tickets' | 'guestlist'>('tables');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, 2026`;
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />

            {/* Hero Image */}
            <View style={styles.heroContainer}>
                <Image source={{ uri: event.image }} style={styles.heroImage} />
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="chevron-back" size={28} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Scrollable Content */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Event Info */}
                <View style={styles.infoSection}>
                    {/* Venue Name and Age Limit */}
                    <View style={styles.topRow}>
                        <Text style={styles.venueName}>{event.venue}</Text>
                        <View style={styles.ageTag}>
                            <Text style={styles.ageText}>21+</Text>
                        </View>
                    </View>

                    {/* Event Name */}
                    <Text style={styles.eventTitle}>{event.name}</Text>

                    {/* Price Level */}
                    <View style={styles.detailsRow}>
                        <Text style={styles.priceLevel}>€€€</Text>
                        <View style={styles.detailItem}>
                            <Icon name="time-outline" size={14} color="#9CA3AF" />
                            <Text style={styles.detailText}>{event.time}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Icon name="ticket-outline" size={14} color="#9CA3AF" />
                            <Text style={styles.detailText}>From €{event.price}</Text>
                        </View>
                    </View>

                    {/* Music Genre */}
                    <View style={styles.genreRow}>
                        <Icon name="musical-notes" size={14} color="#9CA3AF" />
                        <Text style={styles.detailText}>{event.category}</Text>
                    </View>

                    {/* Event Date */}
                    <View style={styles.dateRow}>
                        <Icon name="calendar-outline" size={14} color="#9CA3AF" />
                        <Text style={styles.detailText}>{formatDate(event.date)}</Text>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Description */}
                    <Text style={styles.description}>
                        Experience an unforgettable night of music, dancing, and entertainment at {event.venue}.
                        This exclusive event features top DJs and performers bringing you the best {event.category} music
                        in Barcelona.
                    </Text>

                    {/* Quick Actions */}
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity style={styles.actionButton}>
                            <Icon name="location" size={18} color="#fff" />
                            <Text style={styles.actionText}>Location</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Icon name="logo-instagram" size={18} color="#fff" />
                            <Text style={styles.actionText}>Instagram</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'tables' && styles.activeTab]}
                        onPress={() => setActiveTab('tables')}
                    >
                        <Icon
                            name="people"
                            size={18}
                            color={activeTab === 'tables' ? '#FBBF24' : '#9CA3AF'}
                        />
                        <Text style={[styles.tabText, activeTab === 'tables' && styles.activeTabText]}>
                            Tables
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'tickets' && styles.activeTab]}
                        onPress={() => setActiveTab('tickets')}
                    >
                        <Icon
                            name="ticket"
                            size={18}
                            color={activeTab === 'tickets' ? '#FBBF24' : '#9CA3AF'}
                        />
                        <Text style={[styles.tabText, activeTab === 'tickets' && styles.activeTabText]}>
                            Tickets
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'guestlist' && styles.activeTab]}
                        onPress={() => setActiveTab('guestlist')}
                    >
                        <Icon
                            name="list"
                            size={18}
                            color={activeTab === 'guestlist' ? '#FBBF24' : '#9CA3AF'}
                        />
                        <Text style={[styles.tabText, activeTab === 'guestlist' && styles.activeTabText]}>
                            Guest List
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                <View style={styles.tabContent}>
                    {activeTab === 'tables' && (
                        <View style={styles.emptyState}>
                            <Icon name="people-outline" size={48} color="#4B5563" />
                            <Text style={styles.emptyTitle}>No tables available</Text>
                            <Text style={styles.emptySubtitle}>This event doesn't offer table reservations.</Text>
                        </View>
                    )}

                    {activeTab === 'tickets' && (
                        <View style={styles.emptyState}>
                            <Icon name="ticket-outline" size={48} color="#4B5563" />
                            <Text style={styles.emptyTitle}>No tickets available</Text>
                            <Text style={styles.emptySubtitle}>This event doesn't offer ticket sales.</Text>
                        </View>
                    )}

                    {activeTab === 'guestlist' && (
                        <View style={styles.emptyState}>
                            <Icon name="list-outline" size={48} color="#4B5563" />
                            <Text style={styles.emptyTitle}>Guest list not available</Text>
                            <Text style={styles.emptySubtitle}>This event doesn't have a guest list signup.</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    heroContainer: {
        height: 300,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1F2937',
    },
    backButton: {
        position: 'absolute',
        top: 44,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    infoSection: {
        padding: 16,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    venueName: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    ageTag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#374151',
    },
    ageText: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '600',
    },
    eventTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    priceLevel: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    genreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#374151',
        marginVertical: 16,
    },
    description: {
        color: '#9CA3AF',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    actionsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#374151',
        backgroundColor: '#000',
    },
    actionText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    tabs: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
        paddingHorizontal: 16,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#FBBF24',
    },
    tabText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
    tabContent: {
        padding: 16,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
        backgroundColor: '#1F2937',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#374151',
    },
    emptyTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
    },
    emptySubtitle: {
        color: '#9CA3AF',
        fontSize: 14,
        marginTop: 4,
    },
});

export default EventDetailScreen;
