import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import sessionNames from "./sessionInfo";

const constants = Constants.expoConfig?.extra;

const { role, userKey } = sessionNames;

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
async function save({ key, value }: SecureStoreInterface) {
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
export async function get({ key }: { key: string }) {
    if (OS === "web") {
        // todo logica de consulta de datos seguros almacenados web
    } else {
        return SecureStore.getItem(key);
    }
}

/**
 * function to log in to the system api
 * @param param0
 * @returns
 */
async function login({ email, password }: LoginProps) {
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
                await save({ key: userKey, value: id });

                const { type, name, lastName } = await getUserData({
                    userId: parseInt(userId),
                });

                await save({ key: role, value: type });

                return type && true;
            } else {
                return request;
            }
        })
        .catch((err) => err);
    return request;
}

/**
 * function to get the user data
 * @param param0
 */
async function getUserData({ userId }: { userId: number }): Promise<any> {
    const Authorization = await get({ key: userKey });
    const url = `${API_URL}personnels/${userId}/v2details`;
    return await axios({
        method: "get",
        url,
        headers: {
            "Content-Type": "application/json",
            Authorization,
        },
    })
        .then(async ({ request }) => {
            const response = JSON.parse(request.response);
            return response;
        })
        .catch((err) => console.log("err: ", err));
}

export default login;
