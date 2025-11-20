import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { deletePhoto } from '../utils/storage';
import { StatusBar } from 'expo-status-bar';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhotoDetail'>;
type ScreenRouteProp = RouteProp<RootStackParamList, 'PhotoDetail'>;

export default function PhotoDetailScreen() {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<ScreenRouteProp>();
    const { photoId, uri } = route.params;

    const handleDelete = () => {
        Alert.alert(
            'Delete Photo',
            'Are you sure you want to delete this photo? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deletePhoto(photoId);
                        navigation.goBack();
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Image source={{ uri }} style={styles.image} resizeMode="contain" />

            <View style={styles.overlay}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.iconButton} onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.m,
    },
    iconButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 22,
    },
});
