export interface User {
    id: number;
    name: string;
    mobile: string;
    createdAt: string;
    updatedAt: string;
}

export interface Nightclub {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    imageUrl: string;
    createdAt: string;
}

export interface Event {
    id: number;
    nightclubId: number;
    name: string;
    description: string;
    eventDate: string;
    eventTime: string;
    price: number;
    createdAt: string;
}

export interface DashboardStats {
    version: string;
    totalUsers: number;
}

export interface NotificationPayload {
    userId: number;
    title: string;
    body: string;
}
