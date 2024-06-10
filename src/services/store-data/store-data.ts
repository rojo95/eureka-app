import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type SecureStore = {
    key: string;
    value: string;
};

const { OS } = Platform;

/**
 * function to store data securely
 *
 * @param {SecureStore} param
 * @param {string} param.key
 * @param {string} param.value
 * @returns {Promise<boolean>}
 */
export async function saveSecureData({
    key,
    value,
}: SecureStore): Promise<boolean> {
    try {
        if (OS === "web") {
            // TODO: save secure data on web site
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
 *
 * @param {string} key {string}
 * @returns {Promise<string | null | undefined>}
 */
export async function getSecureData(
    key: string
): Promise<string | null | undefined> {
    try {
        if (OS === "web") {
            // TODO: get secure data stored on web site
        } else {
            const value = await SecureStore.getItemAsync(key);
            return value;
        }
    } catch (error) {
        throw error;
    }
}

/**
 * function to delete the secure storage data
 *
 * @param {string} key
 */
export async function deleteSecureData(key: string): Promise<boolean> {
    try {
        if (OS === "web") {
            // TODO: delete secure data stored on web site
            return true;
        } else {
            return await SecureStore.deleteItemAsync(key)
                .then(() => {
                    return true;
                })
                .catch((err) => {
                    console.error(`Error deleting ${key}`);
                    throw err;
                });
        }
    } catch (error) {
        throw error;
    }
}

/**
 * function to store non secured data
 *
 * @param {SecureStore} param
 * @param {string} param.key
 * @param {string} param.value
 * @returns {Promise<boolean>}
 */
export async function saveData({ key, value }: SecureStore): Promise<boolean> {
    try {
        await AsyncStorage.setItem(key, value);
        return true;
    } catch (error) {
        throw error;
    }
}

/**
 * function to obtain secure storage data
 *
 * @param {string} key {string}
 * @returns {Promise<string | null | undefined>}
 */
export async function getData(key: string): Promise<string | null | undefined> {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        throw error;
    }
}
