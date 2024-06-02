import axios from "axios";
import Constants from "expo-constants";
import sessionNames from "./sessionInfo";
import { getUserData } from "../services/users/users";
import {
    deleteSecureData,
    saveSecureData,
} from "../services/storeData/storeData";

const constants = Constants.expoConfig?.extra;

const { role, userKey, idUser, wcId: idWc } = sessionNames;

export interface LoginProps {
    email: string;
    password: string;
}

const API_URL = constants?.API_URL;

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

                const { type, name, lastName, wcId } = await getUserData({
                    userId: parseInt(userId),
                });

                await saveSecureData({ key: role, value: type });
                await saveSecureData({ key: idWc, value: wcId.toString() });

                return { id: userId, type, name, lastName };
            } else {
                console.error(request);
                throw request;
            }
        })
        .catch((err) => {
            console.error(
                `Error trying to request login: `,
                err.response || err.request || err
            );
            throw err.response || err.request || err;
        });
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
