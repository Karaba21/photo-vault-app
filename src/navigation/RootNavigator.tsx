import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';
import { ActivityIndicator, View } from 'react-native';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import CreatePinScreen from '../screens/CreatePinScreen';
import UnlockScreen from '../screens/UnlockScreen';
import VaultHomeScreen from '../screens/VaultHomeScreen';
import PhotoDetailScreen from '../screens/PhotoDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
    Onboarding: undefined;
    CreatePin: undefined;
    Unlock: undefined;
    VaultHome: undefined;
    PhotoDetail: { photoId: string; uri: string };
    Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    const { isLoading, hasPin, isLocked } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTintColor: theme.colors.text,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: theme.colors.background,
                    },
                }}
            >
                {!hasPin ? (
                    // No PIN -> Onboarding Flow
                    <>
                        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="CreatePin" component={CreatePinScreen} options={{ title: 'Create Passcode' }} />
                    </>
                ) : isLocked ? (
                    // Has PIN but Locked -> Unlock Screen
                    <Stack.Screen name="Unlock" component={UnlockScreen} options={{ headerShown: false }} />
                ) : (
                    // Unlocked -> App Flow
                    <>
                        <Stack.Screen name="VaultHome" component={VaultHomeScreen} options={{ title: 'My Vault' }} />
                        <Stack.Screen name="PhotoDetail" component={PhotoDetailScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
