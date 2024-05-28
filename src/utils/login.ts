import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import sessionNames from "./sessionInfo";
import { getUserData } from "../services/users/users";
import { deleteSecureData, getSecureData, saveSecureData } from "../services/storeData/storeData";

const constants = Constants.expoConfig?.extra;

const { role, userKey, idUser } = sessionNames;

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
                await saveSecureData({ key: userKey, value: id });
                await saveSecureData({ key: idUser, value: userId.toString() });

                const uk = await getSecureData(userKey);

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
            await deleteSecureData(v[1]);
        });
        return { success: true };
    } catch (error) {
        console.error(error);
        return error;
    }
}

export default login;
