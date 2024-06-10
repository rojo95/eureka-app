import Constants from "expo-constants";
import sessionNames from "../../utils/session-info";
import { getSecureData } from "../../services/store-data/store-data";
import axios from "axios";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey } = sessionNames;

export async function getBudgetStates(): Promise<any[]> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}BudgetStates`;
    const query = await axios
        .get(url, {
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
                "Error getting the state data: ",
                err.response || err.request || err
            );
            throw err;
        });
    return query;
}
