import axios from "axios";
import { getSecureData } from "../storeData/storeData";
import Constants from "expo-constants";
import sessionNames from "../../utils/sessionInfo";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey } = sessionNames;

/**
 * function to get the user data
 * @param param0
 */
export async function getUserData({
    userId,
}: {
    userId: number;
}): Promise<any> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}personnels/${userId}/v2details`;
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
        .catch((err) => console.log("err: ", err));
}
