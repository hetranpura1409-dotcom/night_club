import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const signUp = async (firstName: string, lastName: string, email: string, mobile: string, password: string) => {
    const response = await apiClient.post('/auth/signup', { firstName, lastName, email, mobile, password });
    return response.data;
};

export const signIn = async (email: string, password: string) => {
    const response = await apiClient.post('/auth/signin', { email, password });
    return response.data;
};

export const verify = async (mobile: string, code: string) => {
    const response = await apiClient.post('/auth/verify', { mobile, code });
    return response.data;
};

export const getNightclubs = async () => {
    const response = await apiClient.get('/nightclubs');
    return response.data;
};

export const getFeaturedNightclubs = async () => {
    const response = await apiClient.get('/nightclubs/featured');
    return response.data;
};

export const getPopularNightclubs = async (city: string) => {
    const response = await apiClient.get(`/nightclubs/popular/${encodeURIComponent(city)}`);
    return response.data;
};

export const getGuestlistOnlyNightclubs = async () => {
    const response = await apiClient.get('/nightclubs/guestlist-only');
    return response.data;
};

export const getEvents = async () => {
    const response = await apiClient.get('/events');
    return response.data;
};

export const getUpcomingEvents = async () => {
    const response = await apiClient.get('/events');
    // Filter to only future events and sort by date
    const events = response.data;
    const now = new Date();
    return events
        .filter((event: any) => new Date(event.date) >= now)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 10);
};

export const getNotifications = async (userId: string) => {
    const response = await apiClient.get(`/notifications/user/${userId}`);
    return response.data;
};

export const markNotificationAsRead = async (id: string) => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
};

export const getUsers = async () => {
    const response = await apiClient.get('/auth/users');
    return response.data;
};

export const getTables = async () => {
    const response = await apiClient.get('/tables');
    return response.data;
};

export const getTablesByNightclub = async (nightclubId: string) => {
    const response = await apiClient.get(`/tables/nightclub/${nightclubId}`);
    return response.data;
};

export default apiClient;

