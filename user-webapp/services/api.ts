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

// Booking API functions
export const createBooking = async (bookingData: {
    tableId: string;
    bookingDate: string;
    bookingTime: string;
    numberOfGuests: number;
    specialRequests?: string;
}) => {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
};

export const confirmBooking = async (bookingId: string) => {
    const response = await apiClient.patch(`/bookings/${bookingId}/confirm`);
    return response.data;
};

export const getUserBookings = async () => {
    const response = await apiClient.get('/bookings');
    return response.data;
};

export const getBookingById = async (bookingId: string) => {
    const response = await apiClient.get(`/bookings/${bookingId}`);
    return response.data;
};

export const cancelBooking = async (bookingId: string) => {
    const response = await apiClient.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
};

// Reviews API functions
export const submitReview = async (reviewData: {
    userId: string;
    nightclubId: string;
    rating: number;
    comment: string;
    title?: string;
    visitDate?: string;
}) => {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
};

export const getVenueReviews = async (nightclubId: string, sortBy?: string) => {
    const response = await apiClient.get(`/reviews/nightclub/${nightclubId}`, {
        params: { sortBy },
    });
    return response.data;
};

export const getReviewStats = async (nightclubId: string) => {
    const response = await apiClient.get(`/reviews/stats/${nightclubId}`);
    return response.data;
};

export const markReviewHelpful = async (reviewId: string) => {
    const response = await apiClient.post(`/reviews/${reviewId}/helpful`);
    return response.data;
};

// Favorites API functions
export const addFavorite = async (nightclubId: string) => {
    const response = await apiClient.post(`/favorites/${nightclubId}`);
    return response.data;
};

export const removeFavorite = async (nightclubId: string) => {
    const response = await apiClient.delete(`/favorites/${nightclubId}`);
    return response.data;
};

export const getUserFavorites = async () => {
    const response = await apiClient.get('/favorites');
    return response.data;
};

export const checkFavorite = async (nightclubId: string) => {
    const response = await apiClient.get(`/favorites/check/${nightclubId}`);
    return response.data;
};

export default apiClient;

