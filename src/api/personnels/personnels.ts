import axios from "axios";
import { getSecureData } from "../../services/store-data/store-data";
import Constants from "expo-constants";
import sessionNames from "../../utils/sessionInfo";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

/**
 * function to get the user data
 *
 * @param {number} param.userId
 * @returns
 */
export async function getUserData({
    userId,
}: {
    userId: number;
}): Promise<any> {
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

export async function getResponsiblesApi() {
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
