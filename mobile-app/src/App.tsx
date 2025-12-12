import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';

// Import screens
import SplashScreen from './screens/SplashScreen';
import SignUpScreen from './screens/SignUpScreen';
import VerificationScreen from './screens/VerificationScreen';
import MainScreen from './screens/MainScreen';
import BrowseScreen from './screens/BrowseScreen';
import ClubEventsScreen from './screens/ClubEventsScreen';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Splash"
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="Verification" component={VerificationScreen} />
                    <Stack.Screen name="Main" component={MainScreen} />
                    <Stack.Screen name="Browse" component={BrowseScreen} />
                    <Stack.Screen
                        name="ClubEvents"
                        component={ClubEventsScreen}
                        options={{ headerShown: true, title: 'Events' }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}

export default App;
