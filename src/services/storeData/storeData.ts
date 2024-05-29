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
        // todo save secure data on web site
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
        // todo get secure data stored on web site
    } else {
        return SecureStore.getItemAsync(key);
    }
}

export async function deleteSecureItem(key: string): Promise<void> {
    if (OS === "web") {
        // todo delete secure data stored on web site
    } else {
        SecureStore.deleteItemAsync(key);
    }
}
