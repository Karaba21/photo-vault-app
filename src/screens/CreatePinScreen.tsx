import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { theme } from '../styles/theme';
import ScreenContainer from '../components/ScreenContainer';
import PinInput from '../components/PinInput';
import NumericKeypad from '../components/NumericKeypad';
import { savePin } from '../utils/storage';
import { useAuth } from '../context/AuthContext';

export default function CreatePinScreen() {
    const [step, setStep] = useState<'enter' | 'confirm'>('enter');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const { setPinCreated } = useAuth();

    const handlePress = (digit: string) => {
        if (step === 'enter') {
            if (pin.length < 4) {
                const newPin = pin + digit;
                setPin(newPin);
                if (newPin.length === 4) {
                    setTimeout(() => setStep('confirm'), 300);
                }
            }
        } else {
            if (confirmPin.length < 4) {
                const newConfirmPin = confirmPin + digit;
                setConfirmPin(newConfirmPin);
                if (newConfirmPin.length === 4) {
                    handleConfirm(newConfirmPin);
                }
            }
        }
    };

    const handleConfirm = async (finalConfirmPin: string) => {
        if (pin === finalConfirmPin) {
            try {
                await savePin(pin);
                setPinCreated();
            } catch (e) {
                Alert.alert('Error', 'Failed to save PIN');
            }
        } else {
            Alert.alert('Error', 'PINs do not match. Please try again.');
            setStep('enter');
            setPin('');
            setConfirmPin('');
        }
    };

    const handleDelete = () => {
        if (step === 'enter') {
            setPin(prev => prev.slice(0, -1));
        } else {
            setConfirmPin(prev => prev.slice(0, -1));
        }
    };

    return (
        <ScreenContainer centered>
            <View style={styles.header}>
                <Text style={styles.title}>
                    {step === 'enter' ? 'Create Passcode' : 'Confirm Passcode'}
                </Text>
                <Text style={styles.subtitle}>
                    {step === 'enter' ? 'Enter a 4-digit PIN' : 'Re-enter your PIN'}
                </Text>
            </View>

            <PinInput pin={step === 'enter' ? pin : confirmPin} />

            <View style={styles.keypadContainer}>
                <NumericKeypad onPress={handlePress} onDelete={handleDelete} />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
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
});
