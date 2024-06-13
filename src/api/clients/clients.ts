import axios from "axios";
import { getSecureData } from "../../services/store-data/store-data";
import Constants from "expo-constants";
import sessionNames from "../../utils/session-info";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

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
 * function to get the user data
 *
 * @param {number} param.userId
 * @returns
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
