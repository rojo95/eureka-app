import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

interface SecureStoreInterface {
    key: string;
    value: string;
}

const { OS } = Platform;

/**
 * function to store data securely
 * @param param0
 */
export async function saveSecureData({
    key,
    value,
}: SecureStoreInterface): Promise<boolean> {
    try {
        if (OS === "web") {
            // todo logica de almacenamiento de datos seguros web
        } else {
            await SecureStore.setItemAsync(key, value);
        }
        return true;
    } catch (error) {
        throw error;
    }
}

/**
 * function to obtain secure storage data
 * @param param0
 * @returns
 */
export async function getSecureData(
    key: string
): Promise<string | null | undefined> {
    try {
        if (OS === "web") {
            // todo logica de consulta de datos seguros almacenados web
        } else {
            const value = await SecureStore.getItemAsync(key);
            return value;
        }
    } catch (error) {
        throw error;
    }
}

export async function deleteSecureData(key: string): Promise<void> {
    try {
        if (OS === "web") {
            // todo logica de consulta de datos seguros almacenados web
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    } catch (error) {
        throw error;
    }
}
