import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

// Import screens
import SplashScreen from './screens/SplashScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import VerificationScreen from './screens/VerificationScreen';
import MainScreen from './screens/MainScreen';
import BrowseScreen from './screens/BrowseScreen';
import ClubEventsScreen from './screens/ClubEventsScreen';
import EventsScreen from './screens/EventsScreen';
import EventDetailScreen from './screens/EventDetailScreen';

import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import AboutScreen from './screens/AboutScreen';
import SecurityScreen from './screens/SecurityScreen';
import TermsScreen from './screens/TermsScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import AppSettingsScreen from './screens/AppSettingsScreen';
import BookingsScreen from './screens/BookingsScreen';
import BookingDetailScreen from './screens/BookingDetailScreen';
import InteractiveMapScreen from './screens/InteractiveMapScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import VenueDetailScreen from './screens/VenueDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import { NotificationProvider } from './context/NotificationContext';
import { FavoritesProvider } from './context/FavoritesContext';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
    return (
        <>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <NavigationContainer>
                <NotificationProvider>
                    <FavoritesProvider>
                        <Stack.Navigator
                            initialRouteName="Splash"
                            screenOptions={{
                                headerShown: false,
                            }}>
                            <Stack.Screen name="Splash" component={SplashScreen} />
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                            <Stack.Screen name="SignUp" component={SignUpScreen} />
                            <Stack.Screen name="Verification" component={VerificationScreen} />
                            <Stack.Screen name="Main" component={MainScreen} />
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                            <Stack.Screen name="About" component={AboutScreen} />
                            <Stack.Screen name="Security" component={SecurityScreen} />
                            <Stack.Screen name="Terms" component={TermsScreen} />
                            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
                            <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
                            <Stack.Screen name="Bookings" component={BookingsScreen} />
                            <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
                            <Stack.Screen name="Browse" component={BrowseScreen} />
                            <Stack.Screen
                                name="ClubEvents"
                                component={ClubEventsScreen}
                                options={{ headerShown: true, title: 'Events' }}
                            />
                            <Stack.Screen name="Events" component={EventsScreen} />
                            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
                            <Stack.Screen name="VenueDetail" component={VenueDetailScreen} />
                            <Stack.Screen name="Map" component={InteractiveMapScreen} />
                            <Stack.Screen name="Notifications" component={NotificationsScreen} />
                            <Stack.Screen name="Favorites" component={FavoritesScreen} />
                        </Stack.Navigator>
                    </FavoritesProvider>
                </NotificationProvider>
            </NavigationContainer>
        </>
    );
}

export default App;
