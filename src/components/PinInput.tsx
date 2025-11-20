import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { theme } from '../styles/theme';

interface PinInputProps {
    pin: string;
    length?: number;
}

export default function PinInput({ pin, length = 4 }: PinInputProps) {
    return (
        <View style={styles.container}>
            {Array.from({ length }).map((_, index) => {
                const isFilled = index < pin.length;
                return (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            isFilled && styles.dotFilled,
                        ]}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        marginHorizontal: theme.spacing.s,
    },
    dotFilled: {
        backgroundColor: theme.colors.primary,
    },
});
