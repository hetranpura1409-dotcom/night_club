export interface User {
    id: number;
    name: string;
    mobile: string;
    fcmToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Nightclub {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    imageUrl: string;
    createdAt: Date;
}

export interface Event {
    id: number;
    nightclubId: number;
    name: string;
    description: string;
    eventDate: string;
    eventTime: string;
    price: number;
    createdAt: Date;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface SignUpDto {
    name: string;
    mobile: string;
}

export interface VerifyDto {
    mobile: string;
    code: string;
}
