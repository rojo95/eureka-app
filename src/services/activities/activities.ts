import Constants from "expo-constants";
import sessionNames from "../../utils/sessionInfo";
import { getSecureData } from "../storeData/storeData";
import axios from "axios";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

export async function getActivitiesApi(): Promise<any[]> {
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
