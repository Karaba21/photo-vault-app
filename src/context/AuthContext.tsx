import React, { createContext, useState, useEffect, useContext } from 'react';
import { getPin } from '../utils/storage';
import * as LocalAuthentication from 'expo-local-authentication';

interface AuthContextType {
    isLoading: boolean;
    hasPin: boolean;
    isLocked: boolean;
    unlock: () => void;
    setPinCreated: () => void;
    checkBiometrics: () => Promise<boolean>;
    authenticateWithBiometrics: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasPin, setHasPin] = useState(false);
    const [isLocked, setIsLocked] = useState(true);

    useEffect(() => {
        checkPinStatus();
    }, []);

    const checkPinStatus = async () => {
        try {
            const pin = await getPin();
            setHasPin(!!pin);
        } catch (e) {
            console.error('Error checking PIN', e);
        } finally {
            setIsLoading(false);
        }
    };

    const unlock = () => {
        setIsLocked(false);
    };

    const setPinCreated = () => {
        setHasPin(true);
        setIsLocked(false); // Auto unlock after creation
    };

    const checkBiometrics = async () => {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        return hasHardware && isEnrolled;
    };

    const authenticateWithBiometrics = async () => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock Photo Vault',
                fallbackLabel: 'Use PIN',
            });
            if (result.success) {
                unlock();
                return true;
            }
            return false;
        } catch (e) {
            console.error('Biometric auth failed', e);
            return false;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                hasPin,
                isLocked,
                unlock,
                setPinCreated,
                checkBiometrics,
                authenticateWithBiometrics,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
