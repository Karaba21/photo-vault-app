import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { theme } from '../styles/theme';
import ScreenContainer from '../components/ScreenContainer';
import EmptyState from '../components/EmptyState';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { loadPhotos, addPhotos, Photo } from '../utils/storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VaultHome'>;

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const GAP = 1; // Minimal gap like iPhone Photos
const ITEM_SIZE = (width - (GAP * (COLUMN_COUNT - 1))) / COLUMN_COUNT;

export default function VaultHomeScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const data = await loadPhotos();
        setPhotos(data);
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const handleAddPhoto = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission to access camera roll is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uris = result.assets.map(asset => asset.uri);
            const updatedPhotos = await addPhotos(uris);
            setPhotos(updatedPhotos);
        }
    };

    const renderItem = ({ item }: { item: Photo }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('PhotoDetail', { photoId: item.id, uri: item.uri })}
        >
            <Image source={{ uri: item.uri }} style={styles.thumbnail} resizeMode="cover" />
        </TouchableOpacity>
    );

    return (
        <ScreenContainer>
            {photos.length === 0 && !loading ? (
                <EmptyState message="No photos yet. Tap + to add your first private photo." />
            ) : (
                <FlatList
                    data={photos}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={COLUMN_COUNT}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.row}
                />
            )}

            <TouchableOpacity style={styles.fab} onPress={handleAddPhoto}>
                <Ionicons name="add" size={32} color="#000" />
            </TouchableOpacity>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 100,
    },
    row: {
        gap: GAP,
        marginBottom: GAP,
    },
    itemContainer: {
        flex: 1,
        aspectRatio: 1,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.surface,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing.xl,
        right: theme.spacing.xl,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...theme.shadows.medium,
    },
});
