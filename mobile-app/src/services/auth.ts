import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { AuthResponse, SignUpResponse, User } from '../types';

export const authService = {
    async signUp(name: string, mobile: string): Promise<SignUpResponse> {
        const response = await api.post<SignUpResponse>('/auth/signup', { name, mobile });
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

    async getProfile(): Promise<User> {
        const response = await api.get<User>('/auth/me');
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
