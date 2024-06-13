import axios from "axios";
import { getSecureData } from "../../services/store-data/store-data";
import Constants from "expo-constants";
import sessionNames from "../../utils/session-info";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

/**
 * The type `Client` defines properties for a client including business name, CIF/NIF, email, ID, name,
 * person type, profile image, and telephone.
 * @property {string | null} businessName - The `businessName` property in the `Client` type represents
 * the name of the client's business. It is an optional property that can be a string or null.
 * @property {string} cifNif - The `cifNif` property in the `Client` type represents the tax
 * identification number for the client. It is a required field and must be a string value.
 * @property {string | null} email - The `email` property in the `Client` type represents the email
 * address of the client. It is an optional field that can be either a string, `null`, or undefined.
 * @property {number} id - The `id` property in the `Client` type represents a unique identifier for a
 * client. It is of type `number`.
 * @property {string} name - The `name` property in the `Client` type represents the name of the
 * client.
 * @property {string} personType - The `personType` property in the `Client` type represents the type
 * of person associated with the client. It could be a legal entity, individual, or any other category
 * specified in the system.
 * @property {string | null} profileImage - The `profileImage` property in the `Client` type represents
 * an optional string that can hold the URL or path to the client's profile image. It can be either a
 * valid string value or `null` if no profile image is available for the client.
 * @property {string | null} telephone - The `telephone` property in the `Client` type represents the
 * phone number of the client. It is an optional property, meaning it may or may not be present in a
 * `Client` object. If present, it should be a string value or `null`.
 */
export type Client = {
    businessName?: string | null;
    cifNif: string;
    email?: string | null;
    id: number;
    name: string;
    personType: string;
    profileImage?: string | null;
    telephone?: string | null;
};

/**
 * The function `getClientsApi` retrieves client data from an API based on specified parameters and
 * returns a Promise containing the client information.
 * @returns {Promise<Client[]>} The `getClientsApi` function is returning a Promise that resolves to an array of `Client`
 * objects. The function makes a GET request to a specified API endpoint to fetch client data based on
 * certain criteria and returns the response data after processing it.
 */
export async function getClientsApi(): Promise<Client[]> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}Clients`;
    const wcId = ((await getSecureData(idWc)) || "").split(",");

    const params = {
        fields: [
            "id",
            "name",
            "businessName",
            "wcId",
            "personType",
            "defaultVatId",
            "salesLedgerAccountNumber",
        ],
        where: {
            wcId: { inq: wcId },
            or: [{ name: { neq: null } }, { businessName: { neq: null } }],
            personType: { inq: ["lead", "client"] },
        },
        order: "name Asc",
        limit: 100,
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
                "Error getting the clients data: ",
                err.response || err.request || err
            );
            throw err;
        });
}
