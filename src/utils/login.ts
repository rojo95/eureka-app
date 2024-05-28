import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import sessionNames from "./sessionInfo";
import { getUserData } from "../services/users/users";
import { getSecureData, saveSecureData } from "../services/storeData/storeData";

const constants = Constants.expoConfig?.extra;

const { role, userKey, userId: idUser } = sessionNames;

export interface LoginProps {
    email: string;
    password: string;
}

const API_URL = constants?.API_URL;

interface SecureStoreInterface {
    key: string;
    value: string;
}
const { OS } = Platform;

/**
 * function to store data securely
 * @param param0
 */
export async function saveSecure({ key, value }: SecureStoreInterface) {
    if (OS === "web") {
        // todo logica de almacenamiento de datos seguros web
    } else {
        await SecureStore.setItemAsync(key, value);
    }
}

/**
 * function to log in to the system api
 * @param param0
 * @returns
 */
export async function login({ email, password }: LoginProps) {
    const usr = email.trim();
    const pass = password.trim();
    const request = await axios
        .post(
            `${API_URL}personnels/login`,
            {
                email: usr,
                password: pass,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then(async ({ request }) => {
            const { id, userId } = JSON.parse(request.response);
            if (id) {
                console.log("Login successful!");
                await saveSecureData({ key: userKey, value: id });
                await saveSecureData({ key: idUser, value: userId });

                const { type, name, lastName } = await getUserData({
                    userId: parseInt(userId),
                });

                await saveSecureData({ key: role, value: type });

                return { id: userId, type, name, lastName };
            } else {
                return request;
            }
        })
        .catch((err) => err);
    return request;
}

export async function logout() {
    try {
        Object.entries(sessionNames).map(async (v) => {
            await SecureStore.deleteItemAsync(v[1]);
        });
        return { success: true };
    } catch (error) {
        console.log(error);
        return error;
    }
}

export default login;
