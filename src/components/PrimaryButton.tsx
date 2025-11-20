import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../styles/theme';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export default function PrimaryButton({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    style,
}: PrimaryButtonProps) {
    const getBackgroundColor = () => {
        if (disabled) return theme.colors.surface;
        switch (variant) {
            case 'primary':
                return theme.colors.primary;
            case 'secondary':
                return theme.colors.secondary;
            case 'danger':
                return theme.colors.error;
            default:
                return theme.colors.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.textSecondary;
        if (variant === 'secondary') return '#000000';
        return '#000000'; // Primary usually has black text on light purple
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: theme.borderRadius.l,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.l,
        width: '100%',
    },
    text: {
        fontSize: theme.typography.button.fontSize,
        fontWeight: theme.typography.button.fontWeight,
    },
});
