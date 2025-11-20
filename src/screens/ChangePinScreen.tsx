import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { theme } from '../styles/theme';
import ScreenContainer from '../components/ScreenContainer';
import PinInput from '../components/PinInput';
import NumericKeypad from '../components/NumericKeypad';
import { getPin, savePin } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Step = 'verify' | 'enter' | 'confirm';

export default function ChangePinScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [step, setStep] = useState<Step>('verify');
    const [currentPin, setCurrentPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');

    const handlePress = (digit: string) => {
        if (step === 'verify') {
            if (currentPin.length < 4) {
                const updatedPin = currentPin + digit;
                setCurrentPin(updatedPin);
                if (updatedPin.length === 4) {
                    verifyCurrentPin(updatedPin);
                }
            }
        } else if (step === 'enter') {
            if (newPin.length < 4) {
                const updatedPin = newPin + digit;
                setNewPin(updatedPin);
                if (updatedPin.length === 4) {
                    setTimeout(() => setStep('confirm'), 300);
                }
            }
        } else {
            if (confirmPin.length < 4) {
                const updatedPin = confirmPin + digit;
                setConfirmPin(updatedPin);
                if (updatedPin.length === 4) {
                    handleConfirm(updatedPin);
                }
            }
        }
    };

    const verifyCurrentPin = async (enteredPin: string) => {
        try {
            const storedPin = await getPin();
            if (enteredPin === storedPin) {
                setTimeout(() => setStep('enter'), 300);
            } else {
                Alert.alert('Error', 'Incorrect PIN. Please try again.');
                setCurrentPin('');
            }
        } catch (e) {
            Alert.alert('Error', 'Failed to verify PIN');
            setCurrentPin('');
        }
    };

    const handleConfirm = async (finalConfirmPin: string) => {
        if (newPin === finalConfirmPin) {
            try {
                await savePin(newPin);
                Alert.alert('Success', 'Your PIN has been changed successfully.', [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]);
            } catch (e) {
                Alert.alert('Error', 'Failed to save new PIN');
            }
        } else {
            Alert.alert('Error', 'PINs do not match. Please try again.');
            setStep('enter');
            setNewPin('');
            setConfirmPin('');
        }
    };

    const handleDelete = () => {
        if (step === 'verify') {
            setCurrentPin(prev => prev.slice(0, -1));
        } else if (step === 'enter') {
            setNewPin(prev => prev.slice(0, -1));
        } else {
            setConfirmPin(prev => prev.slice(0, -1));
        }
    };

    const getTitle = () => {
        switch (step) {
            case 'verify':
                return 'Verify Current PIN';
            case 'enter':
                return 'Enter New PIN';
            case 'confirm':
                return 'Confirm New PIN';
        }
    };

    const getSubtitle = () => {
        switch (step) {
            case 'verify':
                return 'Enter your current PIN';
            case 'enter':
                return 'Enter a new 4-digit PIN';
            case 'confirm':
                return 'Re-enter your new PIN';
        }
    };

    const getCurrentPin = () => {
        switch (step) {
            case 'verify':
                return currentPin;
            case 'enter':
                return newPin;
            case 'confirm':
                return confirmPin;
        }
    };

    return (
        <ScreenContainer centered>
            <View style={styles.header}>
                <Text style={styles.title}>{getTitle()}</Text>
                <Text style={styles.subtitle}>{getSubtitle()}</Text>
            </View>

            <PinInput pin={getCurrentPin()} />

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
