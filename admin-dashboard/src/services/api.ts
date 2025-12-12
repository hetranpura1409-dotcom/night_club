import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const getNightclubs = async () => {
    const response = await apiClient.get('/nightclubs');
    return response.data;
};

export const createNightclub = async (data: any) => {
    const response = await apiClient.post('/nightclubs', data);
    return response.data;
};

export const deleteNightclub = async (id: string) => {
    const response = await apiClient.delete(`/nightclubs/${id}`);
    return response.data;
};

export const getEvents = async () => {
    const response = await apiClient.get('/events');
    return response.data;
};

export const createEvent = async (data: any) => {
    const response = await apiClient.post('/events', data);
    return response.data;
};

export const deleteEvent = async (id: string) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
};

export const getUsers = async () => {
    const response = await apiClient.get('/auth/users');
    return response.data;
};

export const sendNotification = async (data: any) => {
    const response = await apiClient.post('/notifications', data);
    return response.data;
};

export default apiClient;
