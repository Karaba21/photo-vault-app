import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';
import ScreenContainer from '../components/ScreenContainer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SettingsScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { checkBiometrics } = useAuth();
    const [biometricsSupported, setBiometricsSupported] = useState(false);
    const [biometricsEnabled, setBiometricsEnabled] = useState(false); // In a real app, persist this preference

    useEffect(() => {
        checkBiometrics().then(supported => {
            setBiometricsSupported(supported);
        });
    }, []);

    const handleChangePin = () => {
        navigation.navigate('ChangePin');
    };

    return (
        <ScreenContainer>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security</Text>

                <TouchableOpacity style={styles.row} onPress={handleChangePin}>
                    <View style={styles.rowLeft}>
                        <Ionicons name="keypad-outline" size={24} color={theme.colors.text} />
                        <Text style={styles.rowText}>Change PIN</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={theme.colors.textSecondary} />
                </TouchableOpacity>

                {biometricsSupported && (
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <Ionicons name="finger-print-outline" size={24} color={theme.colors.text} />
                            <Text style={styles.rowText}>Unlock with Biometrics</Text>
                        </View>
                        <Switch
                            value={biometricsEnabled}
                            onValueChange={setBiometricsEnabled}
                            trackColor={{ false: theme.colors.surface, true: theme.colors.primary }}
                            thumbColor={biometricsEnabled ? '#FFF' : '#f4f3f4'}
                        />
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <Ionicons name="information-circle-outline" size={24} color={theme.colors.text} />
                        <Text style={styles.rowText}>Version</Text>
                    </View>
                    <Text style={styles.versionText}>1.0.0</Text>
                </View>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        ...theme.typography.caption,
        marginBottom: theme.spacing.s,
        marginLeft: theme.spacing.s,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
        borderRadius: theme.borderRadius.m,
        marginBottom: theme.spacing.s,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowText: {
        ...theme.typography.body,
        marginLeft: theme.spacing.m,
    },
    versionText: {
        ...theme.typography.body,
        color: theme.colors.textSecondary,
    },
});
