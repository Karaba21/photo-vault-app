import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

interface NumericKeypadProps {
    onPress: (digit: string) => void;
    onDelete: () => void;
}

export default function NumericKeypad({ onPress, onDelete }: NumericKeypadProps) {
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

    return (
        <View style={styles.container}>
            {keys.map((key, index) => {
                if (key === '') {
                    return <View key={index} style={styles.key} />;
                }
                if (key === 'del') {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={styles.key}
                            onPress={onDelete}
                        >
                            <Ionicons name="backspace-outline" size={28} color={theme.colors.text} />
                        </TouchableOpacity>
                    );
                }
                return (
                    <TouchableOpacity
                        key={index}
                        style={styles.key}
                        onPress={() => onPress(key)}
                    >
                        <Text style={styles.keyText}>{key}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 300,
    },
    key: {
        width: '33.33%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyText: {
        fontSize: 28,
        color: theme.colors.text,
        fontWeight: '500',
    },
});
