import AsyncStorage from '@react-native-async-storage/async-storage';

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (raw === null) return fallback;
        return JSON.parse(raw) as T;
    } catch (error) {
        console.warn(`Failed to load "${key}"`, error);
        return fallback;
    }
    
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
}