import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { authService } from '../services/auth';

const SplashScreen = ({ navigation }: any) => {
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const isAuth = await authService.isAuthenticated();
            setTimeout(() => {
                if (isAuth) {
                    navigation.replace('Main');
                } else {
                    navigation.replace('SignUp');
                }
            }, 2000); // Show splash for 2 seconds
        } catch (error) {
            navigation.replace('SignUp');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎉</Text>
            <Text style={styles.appName}>Nightclub App</Text>
            <ActivityIndicator size="large" color="#7C3AED" style={styles.loader} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F2937',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 80,
        marginBottom: 16,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    loader: {
        marginTop: 32,
    },
});

export default SplashScreen;
