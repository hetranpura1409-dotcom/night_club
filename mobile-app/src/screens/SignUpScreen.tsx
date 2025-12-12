import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/auth';

const SignUpScreen = ({ navigation }: any) => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        if (!mobile.trim() || mobile.length < 10) {
            Alert.alert('Error', 'Please enter a valid mobile number');
            return;
        }

        try {
            setLoading(true);
            const response = await authService.signUp(name, mobile);

            // For POC, show the mock code
            Alert.alert(
                'Success',
                `Verification code sent! (Mock: ${response.mockCode})`,
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Verification', { mobile }),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <Text style={styles.emoji}>🎉</Text>
                    <Text style={styles.title}>Welcome!</Text>
                    <Text style={styles.subtitle}>Sign up to discover nightclubs</Text>

                    <View style={styles.form}>
                        <Input
                            placeholder="Full Name"
                            value={name}
                            onChangeText={setName}
                            autoCapitalize="words"
                        />
                        <Input
                            placeholder="Mobile Number"
                            value={mobile}
                            onChangeText={setMobile}
                            keyboardType="phone-pad"
                            maxLength={15}
                        />
                        <Button
                            title="Sign Up"
                            onPress={handleSignUp}
                            loading={loading}
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    emoji: {
        fontSize: 64,
        textAlign: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 48,
    },
    form: {
        width: '100%',
    },
});

export default SignUpScreen;
