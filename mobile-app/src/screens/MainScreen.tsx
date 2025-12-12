import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { authService } from '../services/auth';
import { User } from '../types';

const MainScreen = ({ navigation }: any) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const storedUser = await authService.getStoredUser();
        setUser(storedUser);
    };

    const handleLogout = async () => {
        await authService.logout();
        navigation.replace('SignUp');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.emoji}>🎉</Text>
            <Text style={styles.title}>Welcome Back!</Text>
            {user && (
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.mobile}>{user.mobile}</Text>
                </View>
            )}
            <Text style={styles.subtitle}>
                ✅ You're logged in!{'\n'}
                Browse nightclubs and events below
            </Text>
            <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate('Browse')}
            >
                <Text style={styles.browseText}>🏢 Browse Nightclubs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emoji: {
        fontSize: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 24,
    },
    userInfo: {
        backgroundColor: '#F3F4F6',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        width: '100%',
    },
    name: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    mobile: {
        fontSize: 16,
        color: '#6B7280',
    },
    subtitle: {
        fontSize: 14,
        color: '#7C3AED',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '500',
    },
    browseButton: {
        backgroundColor: '#7C3AED',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
        marginBottom: 16,
        width: '100%',
        alignItems: 'center',
    },
    browseText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MainScreen;
