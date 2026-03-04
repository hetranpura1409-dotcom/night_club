import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert, Modal, FlatList, ActivityIndicator, StatusBar, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { User } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/auth';

// Complete list of country codes
const countryCodes = [
    { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
    { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
    { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
    { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
    { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
    { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
    { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
    { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
    { code: "+47", country: "NO", flag: "🇳🇴", name: "Norway" },
    { code: "+45", country: "DK", flag: "🇩🇰", name: "Denmark" },
    { code: "+358", country: "FI", flag: "🇫🇮", name: "Finland" },
    { code: "+41", country: "CH", flag: "🇨🇭", name: "Switzerland" },
    { code: "+43", country: "AT", flag: "🇦🇹", name: "Austria" },
    { code: "+32", country: "BE", flag: "🇧🇪", name: "Belgium" },
    { code: "+351", country: "PT", flag: "🇵🇹", name: "Portugal" },
    { code: "+30", country: "GR", flag: "🇬🇷", name: "Greece" },
    { code: "+48", country: "PL", flag: "🇵🇱", name: "Poland" },
    { code: "+420", country: "CZ", flag: "🇨🇿", name: "Czech Republic" },
    { code: "+36", country: "HU", flag: "🇭🇺", name: "Hungary" },
    { code: "+353", country: "IE", flag: "🇮🇪", name: "Ireland" },
    { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
    { code: "+380", country: "UA", flag: "🇺🇦", name: "Ukraine" },
    { code: "+90", country: "TR", flag: "🇹🇷", name: "Turkey" },
    { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
    { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
    { code: "+972", country: "IL", flag: "🇮🇱", name: "Israel" },
    { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
    { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
    { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
    { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
    { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
    { code: "+60", country: "MY", flag: "🇲🇾", name: "Malaysia" },
    { code: "+66", country: "TH", flag: "🇹🇭", name: "Thailand" },
    { code: "+62", country: "ID", flag: "🇮🇩", name: "Indonesia" },
    { code: "+63", country: "PH", flag: "🇵🇭", name: "Philippines" },
    { code: "+84", country: "VN", flag: "🇻🇳", name: "Vietnam" },
    { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
    { code: "+64", country: "NZ", flag: "🇳🇿", name: "New Zealand" },
    { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
    { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
    { code: "+54", country: "AR", flag: "🇦🇷", name: "Argentina" },
    { code: "+57", country: "CO", flag: "🇨🇴", name: "Colombia" },
    { code: "+56", country: "CL", flag: "🇨🇱", name: "Chile" },
    { code: "+51", country: "PE", flag: "🇵🇪", name: "Peru" },
    { code: "+20", country: "EG", flag: "🇪🇬", name: "Egypt" },
    { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
    { code: "+234", country: "NG", flag: "🇳🇬", name: "Nigeria" },
    { code: "+254", country: "KE", flag: "🇰🇪", name: "Kenya" },
    { code: "+212", country: "MA", flag: "🇲🇦", name: "Morocco" },
];

// ── Reusable scroll-picker column ────────────────────────────────────────────
const ITEM_H = 44;
const VISIBLE = 5;

const ScrollPickerColumn = ({
    data, selectedIndex, onSelect, flex = 1,
}: {
    data: string[];
    selectedIndex: number;
    onSelect: (i: number) => void;
    flex?: number;
}) => {
    const ref = useRef<ScrollView>(null);
    return (
        <View style={{ flex, height: ITEM_H * VISIBLE, overflow: 'hidden' }}>
            {/* highlight bar */}
            <View pointerEvents="none" style={{
                position: 'absolute', top: ITEM_H * 2,
                left: 0, right: 0, height: ITEM_H,
                borderTopWidth: 1, borderBottomWidth: 1,
                borderColor: '#374151', zIndex: 1,
            }} />
            <ScrollView
                ref={ref}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_H}
                decelerationRate="fast"
                contentContainerStyle={{ paddingVertical: ITEM_H * 2 }}
                onMomentumScrollEnd={e => {
                    const i = Math.round(e.nativeEvent.contentOffset.y / ITEM_H);
                    onSelect(Math.max(0, Math.min(i, data.length - 1)));
                }}
                onLayout={() => {
                    ref.current?.scrollTo({ y: selectedIndex * ITEM_H, animated: false });
                }}
            >
                {data.map((item, i) => (
                    <TouchableOpacity
                        key={i}
                        style={{ height: ITEM_H, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            onSelect(i);
                            ref.current?.scrollTo({ y: i * ITEM_H, animated: true });
                        }}
                    >
                        <Text style={{
                            color: i === selectedIndex ? '#fff' : '#6B7280',
                            fontSize: i === selectedIndex ? 17 : 15,
                            fontWeight: i === selectedIndex ? '700' : '400',
                        }}>{item}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const EditProfileScreen = ({ navigation }: any) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedCountry, setSelectedCountry] = useState(countryCodes.find(c => c.country === 'US') || countryCodes[1]);
    const [birthday, setBirthday] = useState('');
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const [loading, setLoading] = useState(false);

    // Date picker state
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const YEARS = Array.from({ length: 100 }, (_, i) => String(currentYear - i));
    const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
    const [pickerDay, setPickerDay] = useState(1);
    const [pickerMonth, setPickerMonth] = useState(0);
    const [pickerYear, setPickerYear] = useState(currentYear - 25);

    const confirmDate = () => {
        const d = String(pickerDay).padStart(2, '0');
        setBirthday(`${MONTHS[pickerMonth]} ${d}, ${pickerYear}`);
        setShowDatePicker(false);
    };

    // Social Links
    const [instagram, setInstagram] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [facebook, setFacebook] = useState("");

    React.useEffect(() => {
        const loadUser = async () => {
            const user = await authService.getStoredUser();
            if (user) {
                if (user.firstName && user.lastName) {
                    setName(`${user.firstName} ${user.lastName}`);
                } else {
                    setName(user.name || "");
                }
                setEmail(user.email || "");
                if (user.birthday) setBirthday(user.birthday);
                // Smart parse: if mobile starts with a country code, split it out
                const mobile = user.mobile || "";
                const matched = countryCodes.find(c => mobile.startsWith(c.code));
                if (matched) {
                    setSelectedCountry(matched);
                    setPhone(mobile.slice(matched.code.length));
                } else {
                    setPhone(mobile);
                }
            }
        };
        loadUser();
    }, []);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }
        try {
            setLoading(true);
            const parts = name.trim().split(' ');
            const firstName = parts[0];
            const lastName = parts.slice(1).join(' ') || '';
            const fullPhone = phone.trim() ? `${selectedCountry.code}${phone.trim()}` : '';
            await authService.updateProfile({ firstName, lastName, email, mobile: fullPhone || undefined, birthday: birthday || undefined });
            Alert.alert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            const message = error.response?.data?.message;
            const errorMsg = Array.isArray(message) ? message.join('\n') : message || 'Failed to save profile';
            Alert.alert('Error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const filteredCountries = countryCodes.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.code.includes(countrySearch)
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                >
                    <Icon name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarPlaceholder}>
                            <Icon name="person" size={40} color="#9CA3AF" />
                        </View>
                        <TouchableOpacity style={styles.cameraButton}>
                            <Icon name="camera" size={16} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.removeText}>Remove Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Form Fields */}
                <View style={styles.form}>
                    <Text style={styles.label}>FULL NAME</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#6B7280"
                    />

                    <Text style={styles.label}>EMAIL</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#6B7280"
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>PHONE</Text>
                    <View style={styles.phoneRow}>
                        <TouchableOpacity
                            style={styles.countryCodeContainer}
                            onPress={() => setShowCountryPicker(true)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.countryCodeFlag}>{selectedCountry?.flag}</Text>
                            <Text style={styles.countryCodeText}>{selectedCountry?.code}</Text>
                            <Text style={styles.chevron}>▾</Text>
                        </TouchableOpacity>
                        <TextInput
                            style={[styles.input, { flex: 1, marginLeft: 8 }]}
                            value={phone}
                            onChangeText={setPhone}
                            placeholder="Mobile Number"
                            placeholderTextColor="#6B7280"
                            keyboardType="phone-pad"
                            maxLength={10}
                        />
                    </View>

                    <Text style={styles.label}>BIRTHDAY</Text>
                    <TouchableOpacity
                        style={styles.dateTrigger}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.7}
                    >
                        <Icon name="calendar-outline" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                        <Text style={birthday ? styles.dateValue : styles.datePlaceholder}>
                            {birthday || 'Select your birthday'}
                        </Text>
                        <Icon name="chevron-forward" size={16} color="#6B7280" />
                    </TouchableOpacity>

                    <Text style={[styles.label, { marginTop: 20, marginBottom: 10 }]}>CONNECTED ACCOUNTS</Text>

                    {/* Social Inputs */}
                    <View style={styles.socialRow}>
                        <Icon name="logo-instagram" size={24} color="#D946EF" />
                        <TextInput
                            style={styles.socialInput}
                            placeholder="Instagram Username"
                            placeholderTextColor="#6B7280"
                            value={instagram}
                            onChangeText={setInstagram}
                        />
                    </View>

                    <View style={styles.socialRow}>
                        <Icon name="logo-linkedin" size={24} color="#3B82F6" />
                        <TextInput
                            style={styles.socialInput}
                            placeholder="LinkedIn URL"
                            placeholderTextColor="#6B7280"
                            value={linkedin}
                            onChangeText={setLinkedin}
                        />
                    </View>

                    <View style={styles.socialRow}>
                        <Icon name="logo-facebook" size={24} color="#2563EB" />
                        <TextInput
                            style={styles.socialInput}
                            placeholder="Facebook URL"
                            placeholderTextColor="#6B7280"
                            value={facebook}
                            onChangeText={setFacebook}
                        />
                    </View>

                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Icon name="save-outline" size={20} color="#000" style={{ marginRight: 8 }} />
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* ── Birthday Date Picker Modal ─────────────────────────────── */}
            <Modal visible={showDatePicker} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.datePickerSheet}>
                        <View style={styles.datePickerHeader}>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <Text style={styles.datePickerCancel}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.datePickerTitle}>Birthday</Text>
                            <TouchableOpacity onPress={confirmDate}>
                                <Text style={styles.datePickerDone}>Done</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.colHeaders}>
                            <Text style={[styles.colHeader, { flex: 1.2 }]}>Month</Text>
                            <Text style={styles.colHeader}>Day</Text>
                            <Text style={[styles.colHeader, { flex: 1.3 }]}>Year</Text>
                        </View>
                        <View style={styles.columnsRow}>
                            <ScrollPickerColumn
                                data={MONTHS}
                                selectedIndex={pickerMonth}
                                onSelect={setPickerMonth}
                                flex={1.2}
                            />
                            <ScrollPickerColumn
                                data={DAYS}
                                selectedIndex={pickerDay - 1}
                                onSelect={(i) => setPickerDay(i + 1)}
                            />
                            <ScrollPickerColumn
                                data={YEARS}
                                selectedIndex={YEARS.indexOf(String(pickerYear))}
                                onSelect={(i) => setPickerYear(Number(YEARS[i]))}
                                flex={1.3}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Country Picker Modal */}
            <Modal visible={showCountryPicker} animationType="slide" transparent>

                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country Code</Text>
                            <TouchableOpacity onPress={() => { setShowCountryPicker(false); setCountrySearch(''); }} style={styles.modalCloseBtn}>
                                <Text style={styles.modalCloseText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.searchRow}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search country or code..."
                                placeholderTextColor="#6B7280"
                                value={countrySearch}
                                onChangeText={setCountrySearch}
                            />
                        </View>
                        <FlatList
                            data={filteredCountries}
                            keyExtractor={(item, i) => `${item.country}-${i}`}
                            renderItem={({ item }) => {
                                const isSelected = item.country === selectedCountry?.country && item.code === selectedCountry?.code;
                                return (
                                    <TouchableOpacity
                                        style={[styles.countryItem, isSelected && styles.selectedItem]}
                                        onPress={() => { setSelectedCountry(item); setShowCountryPicker(false); setCountrySearch(''); }}
                                    >
                                        <Text style={styles.countryItemFlag}>{item.flag}</Text>
                                        <Text style={styles.countryItemName}>{item.name}</Text>
                                        <Text style={[styles.countryItemCode, isSelected && styles.selectedCode]}>{item.code}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#111827', marginLeft: 52 }} />}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight ?? 0) + 16,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1F2937',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#374151',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#7C3AED',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    removeText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 4,
    },
    form: {
        marginBottom: 20,
    },
    label: {
        color: '#9CA3AF',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#1F2937',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        color: '#fff',
        fontSize: 14,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    countryCodeContainer: {
        backgroundColor: '#1F2937',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        minWidth: 90,
    },
    countryCodeFlag: {
        fontSize: 18,
    },
    countryCodeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    chevron: {
        color: '#9CA3AF',
        fontSize: 10,
    },
    socialRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1F2937',
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    socialInput: {
        flex: 1,
        marginLeft: 12,
        paddingVertical: 12,
        color: '#fff',
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: '#7C3AED',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#111827',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
        paddingBottom: 30,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#374151',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    modalCloseBtn: { padding: 4 },
    modalCloseText: { color: '#9CA3AF', fontSize: 18 },
    searchRow: { padding: 12 },
    searchInput: {
        backgroundColor: '#1F2937',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        color: '#fff',
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#374151',
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        gap: 12,
    },
    selectedItem: { backgroundColor: 'rgba(251,191,36,0.1)' },
    countryItemFlag: {
        fontSize: 24,
    },
    countryItemName: {
        flex: 1,
        color: '#D1D5DB',
        fontSize: 15,
    },
    countryItemCode: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '600',
    },
    selectedCode: { color: '#FBBF24' },

    // Date trigger
    dateTrigger: {
        backgroundColor: '#1F2937',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 13,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateValue: {
        flex: 1,
        color: '#fff',
        fontSize: 14,
    },
    datePlaceholder: {
        flex: 1,
        color: '#6B7280',
        fontSize: 14,
    },

    // Date picker sheet
    datePickerSheet: {
        backgroundColor: '#111827',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
    },
    datePickerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
    },
    datePickerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    datePickerCancel: {
        color: '#9CA3AF',
        fontSize: 15,
    },
    datePickerDone: {
        color: '#7C3AED',
        fontSize: 15,
        fontWeight: '700',
    },
    colHeaders: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    colHeader: {
        flex: 1,
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    columnsRow: {
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingBottom: 16,
    },
});

export default EditProfileScreen;
