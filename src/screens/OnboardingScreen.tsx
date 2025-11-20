import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;

export default function OnboardingScreen() {
    const navigation = useNavigation<NavigationProp>();

    return (
        <ScreenContainer centered>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="lock-closed" size={64} color={theme.colors.primary} />
                </View>
                <Text style={styles.title}>Private Photo Vault</Text>
                <Text style={styles.subtitle}>
                    Store your private photos in a secure vault protected by a passcode or biometrics.
                </Text>
            </View>
            <View style={styles.footer}>
                <PrimaryButton
                    title="Get Started"
                    onPress={() => navigation.navigate('CreatePin')}
                />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        ...theme.shadows.medium,
    },
    title: {
        ...theme.typography.h1,
        textAlign: 'center',
        marginBottom: theme.spacing.m,
    },
    subtitle: {
        ...theme.typography.body,
        textAlign: 'center',
        color: theme.colors.textSecondary,
    },
    footer: {
        width: '100%',
        paddingBottom: theme.spacing.xl,
    },
});
