import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

// Railway production backend
const PRODUCTION_API = 'https://nightclub-production-0053.up.railway.app/api';

// Local dev: Android Emulator uses 10.0.2.2, physical device uses local WiFi IP
const DEV_API = Platform.OS === 'android'
    ? 'http://10.0.2.2:3000/api'       // Android Emulator
    : 'http://localhost:3000/api';       // iOS Simulator

const API_BASE_URL = __DEV__ ? DEV_API : PRODUCTION_API;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests automatically
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
