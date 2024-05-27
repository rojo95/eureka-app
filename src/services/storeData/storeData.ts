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
}: SecureStoreInterface): Promise<void> {
    if (OS === "web") {
        // todo logica de almacenamiento de datos seguros web
    } else {
        await SecureStore.setItemAsync(key, value);
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
    if (OS === "web") {
        // todo logica de consulta de datos seguros almacenados web
    } else {
        return SecureStore.getItemAsync(key);
    }
}

export async function deleteSecureItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
}
