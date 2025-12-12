import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Input from '../components/Input';
import Button from '../components/Button';
import { authService } from '../services/auth';

const VerificationScreen = ({ route, navigation }: any) => {
    const { mobile } = route.params;
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (code.length !== 6) {
            Alert.alert('Error', 'Please enter a 6-digit code');
            return;
        }

        try {
            setLoading(true);
            await authService.verify(mobile, code);
            navigation.replace('Main');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <Text style={styles.emoji}>📱</Text>
                <Text style={styles.title}>Enter Code</Text>
                <Text style={styles.subtitle}>
                    We sent a verification code to{'\n'}
                    <Text style={styles.mobile}>{mobile}</Text>
                </Text>
                <Text style={styles.hint}>💡 For POC, use any 6-digit code</Text>

                <View style={styles.form}>
                    <Input
                        placeholder="000000"
                        value={code}
                        onChangeText={setCode}
                        keyboardType="number-pad"
                        maxLength={6}
                        textAlign="center"
                        style={styles.codeInput}
                    />
                    <Button
                        title="Verify"
                        onPress={handleVerify}
                        loading={loading}
                        disabled={code.length !== 6}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        marginBottom: 16,
    },
    mobile: {
        fontWeight: '600',
        color: '#7C3AED',
    },
    hint: {
        fontSize: 14,
        color: '#F59E0B',
        textAlign: 'center',
        marginBottom: 32,
        backgroundColor: '#FEF3C7',
        padding: 12,
        borderRadius: 8,
    },
    form: {
        width: '100%',
    },
    codeInput: {
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: 8,
    },
});

export default VerificationScreen;
