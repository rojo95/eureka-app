import Constants from "expo-constants";
import sessionNames from "../../utils/session-info";
import { getSecureData } from "../../services/store-data/store-data";
import axios from "axios";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey } = sessionNames;

/**
 * The type `BudgetState` represents an object with properties `id`, `name`, and `value`, all of type
 * `number` or `string`.
 * @property {number} id - The `id` property in the `BudgetState` type represents a unique identifier
 * for a budget item.
 * @property {string} name - The `name` property in the `BudgetState` type represents the name of a
 * budget item.
 * @property {string} value - The `value` property in the `BudgetState` type represents the budget
 * amount associated with a particular budget item. It is of type `string`, which means it can hold any
 * string value representing the budget amount.
 */
export type BudgetState = { id: number; name: string; value: string };

/**
 * The function `getBudgetStates` retrieves budget state data from an API using a secure authorization
 * token.
 * @returns {Promise<BudgetState[]>} The `getBudgetStates` function is returning a Promise that resolves to an array of
 * `BudgetState` objects. The function makes an asynchronous call to fetch budget states data from the
 * API using Axios, and then processes the response to return the data.
 */
export async function getBudgetStates(): Promise<BudgetState[]> {
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
