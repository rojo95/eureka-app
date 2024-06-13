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
 * @property {string} email - The `email` property in the `LoginProps` type represents the email
 * address that a user would use to log in.
 * @property {string} password - The `password` property in the `LoginProps` type represents the
 * password input that a user would enter when trying to log in to a system or application. It is
 * typically a string value that should be kept secure and encrypted to protect the user's sensitive
 * information.
 */
export type LoginProps = {
    email: string;
    password: string;
};

const API_URL = constants?.API_URL;

/**
 * The function `login` in TypeScript makes a POST request to a login endpoint, processes the response
 * data, and saves relevant user information securely.
 * @param {LoginProps} params
 * @param {string} params.email
 * @param {string} params.password
 * - The `login` function you provided is an asynchronous function that handles
 * user login by sending a POST request to a specific API endpoint. It takes an object as a parameter
 * with `email` and `password` properties.
 * @returns {Promise<{ id: number; type: string; name: string; lastName: string }>} The `login` function is returning an object with the properties `id`, `type`, `name`, and
 * `lastName` if the login request is successful. If there is an error during the login process, it
 * will log the error and throw it.
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
 * @returns {{ success: true }} The `logout` function is returning an object with a `success` property set to `true` if the
 * logout process is successful.
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
