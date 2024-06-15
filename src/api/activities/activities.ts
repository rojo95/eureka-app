import Constants from "expo-constants";
import sessionNames from "../../utils/session-info";
import { getSecureData } from "../../services/store-data/store-data";
import axios from "axios";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

/**
 * The type `Activity` defines a structure with properties for activity type ID, ID, name, and WC ID.
 */
export type Activity = {
    activityTypeId: number;
    id: number;
    name: string;
    wcId: number;
};

/**
 * This function fetches activities data from an API based on certain criteria and returns
 * the result as a Promise.
 */
export async function getActivitiesApi(): Promise<Activity[]> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}Activities`;
    const wcId = ((await getSecureData(idWc)) || "").split(",");
    const params = {
        where: { wcId: { inq: wcId }, activityTypeId: { neq: 3 } },
        include: "activityType",
        order: "name asc",
    };

    const query = await axios
        .get(url, {
            params: { filter: JSON.stringify(params) },
            headers: {
                "Content-Type": "application/json",
                Authorization,
            },
        })
        .then(async ({ request }) => {
            const response = JSON.parse(request.response);
            return response;
        })
        .catch((err) => {
            console.error(
                "Error getting the activities data: ",
                err.response || err.request || err
            );
            throw err;
        });
    return query;
}
