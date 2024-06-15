import axios from "axios";
import Constants from "expo-constants";
import sessionNames from "../../utils/session-info";
import { getUserData } from "../personnels/personnels";
import {
    deleteSecureData,
    saveSecureData,
} from "../../services/store-data/store-data";

const constants = Constants.expoConfig?.extra;

const { role, userKey, userId: idUser, wcId: idWc } = sessionNames;

/**
 * The above type defines the props required for a login component, including email and password
 * fields.
 */
export type LoginProps = {
    email: string;
    password: string;
};

const API_URL = constants?.API_URL;

/**
 * The function `login` makes a POST request to a login endpoint, processes the response
 * data, and saves relevant user information securely.
 */
export async function login({ email, password }: LoginProps): Promise<{
    id: number;
    type: string;
    name: string;
    lastName: string;
}> {
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

/**
 * The `logout` function asynchronously deletes secure data associated with session names and returns a
 * success status.
 */
export async function logout(): Promise<{ success: true }> {
    try {
        Object.entries(sessionNames).map(async (v) => {
            await deleteSecureData(v[1]);
        });
        return { success: true };
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default login;
