import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';
import { StatusBar } from 'expo-status-bar';

interface ScreenContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    centered?: boolean;
}

export default function ScreenContainer({ children, style, centered = false }: ScreenContainerProps) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar style="light" />
            <View style={[styles.container, centered && styles.centered, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
        paddingHorizontal: theme.spacing.m,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
