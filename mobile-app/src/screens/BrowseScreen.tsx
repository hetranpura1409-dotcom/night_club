import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Image,
    StatusBar,
    Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import apiClient from '../services/api';

type BrowseScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Browse'
>;

type Props = {
    navigation: BrowseScreenNavigationProp;
};

interface Nightclub {
    id: string;
    name: string;
    description: string;
    location: string;
    imageUrl?: string;
}

export default function BrowseScreen({ navigation }: Props) {
    const [nightclubs, setNightclubs] = useState<Nightclub[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNightclubs();
    }, []);

    const loadNightclubs = async () => {
        try {
            const response = await apiClient.get('/nightclubs');
            setNightclubs(response.data);
        } catch (error) {
            console.error('Failed to load nightclubs:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderNightclub = ({ item }: { item: Nightclub }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ClubEvents', { club: item })}
        >
            {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
            ) : (
                <View style={styles.placeholderImage}>
                    <Text style={styles.placeholderText}>🏢</Text>
                </View>
            )}
            <View style={styles.cardContent}>
                <Text style={styles.clubName}>{item.name}</Text>
                <Text style={styles.location}>📍 {item.location}</Text>
                <Text style={styles.description} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#7C3AED" />
                <Text style={styles.loadingText}>Loading nightclubs...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={styles.headerContainer}>
                <Text style={styles.header}>🎉 Browse Nightclubs</Text>
            </View>
            <FlatList
                data={nightclubs}
                renderItem={renderNightclub}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        No nightclubs available. Add some via Admin Dashboard!
                    </Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerContainer: {
        paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 16,
        backgroundColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#1F2937',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingHorizontal: 20,
        paddingBottom: 16,
        color: '#fff',
    },
    list: {
        padding: 15,
    },
    card: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: '#e5e7eb',
    },
    placeholderImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#7C3AED',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 60,
    },
    cardContent: {
        padding: 15,
    },
    clubName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1d29',
        marginBottom: 5,
    },
    location: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6B7280',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#6B7280',
        marginTop: 50,
    },
});
