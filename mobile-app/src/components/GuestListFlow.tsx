import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Alert,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { User, Nightclub } from '../types';
import Button from './Button';

interface GuestListFlowProps {
    visible: boolean;
    onClose: () => void;
    club: Nightclub;
    user: User | null;
}

const GuestListFlow: React.FC<GuestListFlowProps> = ({ visible, onClose, club, user }) => {
    const [step, setStep] = useState(0);
    const [guestCount, setGuestCount] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    // Generate next 7 days for date selection
    const availableDates = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return d;
    });

    const handleConfirm = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                'Guest List Joined!',
                `You are on the list for ${club.name} on ${selectedDate.toLocaleDateString()}.`,
                [{ text: 'Cool', onPress: onClose }]
            );
        }, 1500);
    };

    const renderContent = () => {
        if (step === 0) {
            return (
                <ScrollView style={styles.contentScroll}>
                    <Text style={styles.sectionTitle}>Select Date</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesRow}>
                        {availableDates.map((date, index) => {
                            const isSelected = date.toDateString() === selectedDate.toDateString();
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                                    onPress={() => setSelectedDate(date)}
                                >
                                    <Text style={[styles.dateDay, isSelected && styles.dateTextSelected]}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </Text>
                                    <Text style={[styles.dateNum, isSelected && styles.dateTextSelected]}>
                                        {date.getDate()}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <Text style={styles.sectionTitle}>Total Guests</Text>
                    <View style={styles.guestControl}>
                        <TouchableOpacity
                            style={styles.guestBtn}
                            onPress={() => setGuestCount(Math.max(1, guestCount - 1))}
                        >
                            <Icon name="remove" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.guestCount}>{guestCount}</Text>
                        <TouchableOpacity
                            style={styles.guestBtn}
                            onPress={() => setGuestCount(Math.min(10, guestCount + 1))}
                        >
                            <Icon name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Notes (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Any special requests?"
                        placeholderTextColor="#6B7280"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                    />

                    <View style={styles.infoBox}>
                        <Icon name="information-circle-outline" size={20} color="#FBBF24" />
                        <Text style={styles.infoText}>
                            Guest list guarantees entry before 11:30 PM. Cover charge may still apply.
                        </Text>
                    </View>
                </ScrollView>
            );
        }
        return null;
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Join Guest List</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Icon name="close" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View style={styles.contentContainer}>
                        {renderContent()}
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Button
                            title="Join List"
                            onPress={handleConfirm}
                            loading={loading}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#111827',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '70%',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeBtn: {
        padding: 4,
    },
    contentContainer: {
        flex: 1,
    },
    contentScroll: {
        padding: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        marginTop: 10,
    },
    datesRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    dateCard: {
        width: 70,
        height: 80,
        backgroundColor: '#1F2937',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#374151',
    },
    dateCardSelected: {
        backgroundColor: '#FBBF24',
        borderColor: '#FBBF24',
    },
    dateDay: {
        color: '#9CA3AF',
        fontSize: 14,
        marginBottom: 4,
    },
    dateNum: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    dateTextSelected: {
        color: '#000',
    },
    guestControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1F2937',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    guestBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#374151',
        alignItems: 'center',
        justifyContent: 'center',
    },
    guestCount: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 24,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    infoText: {
        color: '#FBBF24',
        marginLeft: 12,
        flex: 1,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#1F2937',
        paddingBottom: 40,
    },
});

export default GuestListFlow;
