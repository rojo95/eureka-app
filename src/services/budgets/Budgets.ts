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
export async function getBudgets({
    page,
    limit,
    fields,
    textFilter,
}: {
    page: number;
    limit: number;
    fields?: string[];
    textFilter?: string;
}): Promise<any> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}Budgets/list`;
    const fieldsDefault: string[] = [
        "id",
        "number",
        "title",
        "clientId",
        "stateId",
        "totalCost",
        "totalSale",
        "createdAt",
        "updatedAt",
        "wcId",
        "personnelResponsibleId",
        "activityId",
        "discount",
        "isActivityByAdministration",
    ];
    const params = {
        filter: {
            where: {
                wcId: { inq: [3] },
                isActivityByAdministration: false,
                ...(textFilter && {
                    and: [
                        {
                            or: [
                                { title: { like: `%${textFilter}%` } },
                                { number: { like: `%${textFilter}%` } },
                            ],
                        },
                    ],
                }),
            },
            fields: fields || fieldsDefault,
            limit: limit,
            offset: (page - 1) * limit,
            include: [
                "client",
                "state",
                "workCenter",
                "responsible",
                "activity",
            ],
            order: "title ASC",
        },
    };

    const query = await axios
        .get(url, {
            params: { filter: JSON.stringify(params.filter) },
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
            console.error("err: ", err.response);
            return err.response;
        });
    return query;
}
