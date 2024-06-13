import axios from "axios";
import { getSecureData } from "../../services/store-data/store-data";
import Constants from "expo-constants";
import sessionNames from "../../utils/session-info";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

/**
 * The Personnel type defines properties for an personnrl/uesr's email, ID, last name, full name, name,
 * type, and work center ID.
 * @property {string} email - Email address of the personnel.
 * @property {number} id - The `id` property in the `Personnel` type represents the unique identifier
 * for a personnel.
 * @property {string} lastName - The `lastName` property in the `Personnel` type represents the last
 * name of a person.
 * @property {string} fullName - The `fullName` property in the `Personnel` type represents the full
 * name of a person. It is a string type property that combines the first name and last name of the
 * person.
 * @property {string} name - The `name` property in the `Personnel` type represents the name of the
 * personnel.
 * @property {string} type - The `Personnel` type consists of the following properties:
 * @property {number} wcId - The `wcId` property in the `Personnel` type represents the unique
 * identifier for a personnel in a system.
 */
export type Personnel = {
    email: string;
    id: number;
    lastName: string;
    fullName: string;
    name: string;
    type: string;
    wcId: number;
};

/**
 * function to get the user data
 *
 * @param {number} param.userId
 * @returns
 */
/**
 * This TypeScript function retrieves detailed personnel data for a specific user ID using an API
 * endpoint with authorization.
 *@param {number} param.userId  - The `getUserData` function is an asynchronous function that takes an object as a parameter
 * with a `userId` property of type number. It returns a Promise that resolves to a `Personnel` object.
 * @returns {Promise<Personnel>} The `getUserData` function is returning a Promise that resolves to the personnel data of a
 * user with the specified `userId`.
 */
export async function getUserData({
    userId,
}: {
    userId: number;
}): Promise<Personnel> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}Personnels/${userId}/v2details`;
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
        .catch((err) => {
            console.error(
                "Error getting the users data: ",
                err.response || err.request || err
            );
            throw err;
        });
}

interface Responsible extends Personnel {
    profileImage: string;
}

/**
 * The function `getResponsiblesApi` retrieves active personnel data based on specific criteria from an
 * API using Axios in TypeScript.
 * @returns { Promise<Responsible[]> }
 * The `getResponsiblesApi` function is returning a Promise that resolves to an array of
 * `Personnel` objects. The function makes a GET request to a specific API endpoint to fetch active
 * personnel data based on certain criteria, such as filtering by `wcId` and excluding personnel of
 * type "OPERARIO". The response data is then parsed and returned. If there is an error during the API
 * request
 */
export async function getResponsiblesApi(): Promise<Responsible[]> {
    const url = `${API_URL}Personnels/findActive`;
    const Authorization = await getSecureData(userKey);
    const wcId = ((await getSecureData(idWc)) || "").split(",");

    const params = {
        where: { wcId: { inq: wcId } },
        type: { neq: "OPERARIO" },
        order: "name asc",
    };

    return await axios
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
                "Error getting the responsibles: ",
                err.response || err.request || err
            );
            throw err;
        });
}
