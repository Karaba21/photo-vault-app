import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import ScreenContainer from '../components/ScreenContainer';
import PinInput from '../components/PinInput';
import NumericKeypad from '../components/NumericKeypad';
import { getPin } from '../utils/storage';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function UnlockScreen() {
    const [pin, setPin] = useState('');
    const { unlock, checkBiometrics, authenticateWithBiometrics } = useAuth();
    const [canUseBiometrics, setCanUseBiometrics] = useState(false);

    useEffect(() => {
        checkBiometrics().then(setCanUseBiometrics);
    }, []);

    useEffect(() => {
        if (canUseBiometrics) {
            authenticateWithBiometrics();
        }
    }, [canUseBiometrics]);

    const handlePress = (digit: string) => {
        if (pin.length < 4) {
            const newPin = pin + digit;
            setPin(newPin);
            if (newPin.length === 4) {
                verifyPin(newPin);
            }
        }
    };

    const verifyPin = async (enteredPin: string) => {
        try {
            const storedPin = await getPin();
            if (enteredPin === storedPin) {
                unlock();
            } else {
                Alert.alert('Error', 'Incorrect PIN');
                setPin('');
            }
        } catch (e) {
            console.error(e);
            setPin('');
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    return (
        <ScreenContainer centered>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="lock-closed" size={48} color={theme.colors.primary} />
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Enter your PIN to unlock</Text>
            </View>

            <PinInput pin={pin} />

            <View style={styles.keypadContainer}>
                <NumericKeypad onPress={handlePress} onDelete={handleDelete} />
            </View>

            {canUseBiometrics && (
                <TouchableOpacity style={styles.biometricButton} onPress={authenticateWithBiometrics}>
                    <Ionicons name="finger-print" size={32} color={theme.colors.primary} />
                    <Text style={styles.biometricText}>Use Biometrics</Text>
                </TouchableOpacity>
            )}
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    iconContainer: {
        marginBottom: theme.spacing.m,
    },
    title: {
        ...theme.typography.h2,
        marginBottom: theme.spacing.s,
    },
    subtitle: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    },
    keypadContainer: {
        marginTop: theme.spacing.xl,
        width: '100%',
        alignItems: 'center',
    },
    biometricButton: {
        marginTop: theme.spacing.l,
        alignItems: 'center',
    },
    biometricText: {
        marginTop: theme.spacing.xs,
        color: theme.colors.primary,
        fontSize: theme.typography.button.fontSize,
    },
});
