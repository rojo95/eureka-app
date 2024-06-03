import Constants from "expo-constants";
import sessionNames from "../../utils/sessionInfo";
import { getSecureData } from "../storeData/storeData";
import axios from "axios";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey } = sessionNames;

export async function getStatesApi(): Promise<any[]> {
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
            throw err.response || err.request || err;
        });
    return query;
}
