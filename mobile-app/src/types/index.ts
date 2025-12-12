export interface User {
    id: number;
    name: string;
    mobile: string;
    fcmToken?: string;
    createdAt: string;
}

export interface Nightclub {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    imageUrl: string;
}

export interface Event {
    id: number;
    nightclubId: number;
    name: string;
    description: string;
    eventDate: string;
    eventTime: string;
    price: number;
}

export interface SignUpResponse {
    message: string;
    mobile: string;
    mockCode?: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export type RootStackParamList = {
    Splash: undefined;
    SignUp: undefined;
    Verification: { mobile: string };
    Main: undefined;
    Browse: undefined;
    ClubEvents: { club: { id: string; name: string; description: string; location: string; imageUrl?: string } };
};
