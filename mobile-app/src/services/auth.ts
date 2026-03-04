import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { AuthResponse, SignUpResponse, User, SignUpData } from '../types';

export const authService = {
    async signUp(data: SignUpData): Promise<SignUpResponse> {
        const response = await api.post<SignUpResponse>('/auth/signup', data);
        return response.data;
    },

    async verify(mobile: string, code: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/verify', { mobile, code });
        const { accessToken, user } = response.data;

        // Store token and user data
        await AsyncStorage.setItem('authToken', accessToken);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        return response.data;
    },

    async signIn(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/signin', { email, password });
        const { accessToken, user } = response.data;

        // Store token and user data
        await AsyncStorage.setItem('authToken', accessToken);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        return response.data;
    },

    async getProfile(): Promise<User> {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    async updateProfile(data: { firstName?: string; lastName?: string; email?: string; mobile?: string; birthday?: string }): Promise<User> {
        const response = await api.patch<User>('/auth/profile', data);
        // Keep local AsyncStorage in sync
        const existing = await AsyncStorage.getItem('user');
        if (existing) {
            const updated = { ...JSON.parse(existing), ...response.data };
            await AsyncStorage.setItem('user', JSON.stringify(updated));
        }
        return response.data;
    },

    async logout(): Promise<void> {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('user');
    },

    async isAuthenticated(): Promise<boolean> {
        const token = await AsyncStorage.getItem('authToken');
        return !!token;
    },

    async getStoredUser(): Promise<User | null> {
        const userStr = await AsyncStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
};
