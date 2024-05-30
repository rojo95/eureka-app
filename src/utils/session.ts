import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import sessionNames from "./sessionInfo";
import { saveSecureData } from "../services/storeData/storeData";
import { getUserData } from "../services/users/users";

const constants = Constants.expoConfig?.extra;

const { role, userKey } = sessionNames;

export interface LoginProps {
    email: string;
    password: string;
}

const API_URL = constants?.API_URL;

const { OS } = Platform;

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
                await saveSecureData({ key: userKey, value: id });

                const { type, name, lastName } = await getUserData({
                    userId: parseInt(userId),
                });

                await saveSecureData({ key: role, value: type });

                return type && true;
            } else {
                return request;
            }
        })
        .catch((err) => err);
    return request;
}


export default login;
