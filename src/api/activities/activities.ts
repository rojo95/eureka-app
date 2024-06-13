import Constants from "expo-constants";
import sessionNames from "../../utils/session-info";
import { getSecureData } from "../../services/store-data/store-data";
import axios from "axios";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

/**
 * The type `Activity` defines a structure with properties for activity type ID, ID, name, and WC ID.
 * @property {number} activityTypeId - The `activityTypeId` property in the `Activity` type represents
 * the unique identifier for the type of activity. It is a number data type.
 * @property {number} id - The `id` property in the `Activity` type represents the unique identifier
 * for an activity.
 * @property {string} name - The `name` property in the `Activity` type represents the name of the
 * activity. It is a string type.
 * @property {number} wcId - The `wcId` property in the `Activity` type represents the ID of the work
 * center associated with the activity.
 */
export type Activity = {
    activityTypeId: number;
    id: number;
    name: string;
    wcId: number;
};

/**
 * This TypeScript function fetches activities data from an API based on certain criteria and returns
 * the result as a Promise.
 * @returns {Promise<Activity[]>} The `getActivitiesApi` function is returning a Promise that resolves to an array of
 * `Activity` objects.
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
