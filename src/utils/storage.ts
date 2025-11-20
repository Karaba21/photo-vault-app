import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_KEY = 'user_pin';
const PHOTOS_KEY = 'photos_metadata';
// @ts-ignore
const PHOTOS_DIR = FileSystem.documentDirectory + 'photos/';

export interface Photo {
    id: string;
    uri: string;
    createdAt: number;
}

// --- PIN Logic ---

export const savePin = async (pin: string) => {
    await SecureStore.setItemAsync(PIN_KEY, pin);
};

export const getPin = async () => {
    return await SecureStore.getItemAsync(PIN_KEY);
};

export const deletePin = async () => {
    await SecureStore.deleteItemAsync(PIN_KEY);
};

// --- Photos Logic ---

// Ensure photos directory exists
const ensureDirExists = async () => {
    const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
    }
};

export const loadPhotos = async (): Promise<Photo[]> => {
    try {
        const json = await AsyncStorage.getItem(PHOTOS_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        console.error('Failed to load photos metadata', e);
        return [];
    }
};

export const addPhotos = async (newImages: string[]): Promise<Photo[]> => {
    await ensureDirExists();
    const currentPhotos = await loadPhotos();
    const newPhotos: Photo[] = [];

    for (const uri of newImages) {
        const filename = uri.split('/').pop();
        const newPath = PHOTOS_DIR + filename;

        try {
            await FileSystem.moveAsync({
                from: uri,
                to: newPath,
            });

            newPhotos.push({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                uri: newPath,
                createdAt: Date.now(),
            });
        } catch (e) {
            console.error('Failed to copy image', e);
        }
    }

    const updatedPhotos = [...newPhotos, ...currentPhotos]; // Newest first
    await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(updatedPhotos));
    return updatedPhotos;
};

export const deletePhoto = async (photoId: string): Promise<Photo[]> => {
    const currentPhotos = await loadPhotos();
    const photoToDelete = currentPhotos.find(p => p.id === photoId);

    if (photoToDelete) {
        try {
            await FileSystem.deleteAsync(photoToDelete.uri, { idempotent: true });
        } catch (e) {
            console.error('Failed to delete image file', e);
        }
    }

    const updatedPhotos = currentPhotos.filter(p => p.id !== photoId);
    await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(updatedPhotos));
    return updatedPhotos;
};
