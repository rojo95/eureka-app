import axios from "axios";
import { getSecureData } from "../storeData/storeData";
import Constants from "expo-constants";
import sessionNames from "../../utils/sessionInfo";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

/**
 * function to get the user data
 * @param param0
 */
export async function getBudgets({
    page,
    limit,
    fields,
    textFilter,
    client,
    states,
    responsibles,
    activities,
    createdFrom,
    createdTo,
}: {
    page: number;
    limit: number;
    fields?: string[];
    textFilter?: string;
    client?: number;
    states?: number[];
    responsibles?: number[];
    activities?: number[];
    createdFrom?: Date;
    createdTo?: Date;
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
    const wcId = ((await getSecureData(idWc)) || "")
        .split(",")
        .map((v) => parseInt(v));

    const params = {
        where: {
            wcId: { inq: wcId },
            isActivityByAdministration: false,
            ...(responsibles && { responsibles: responsibles }),
            ...(activities && { activities: activities }),
            ...(client && { clients: client }),
            ...(states && { states: states }),
            ...(createdFrom && { createdFrom: createdFrom }),
            ...(createdTo && { createdTo: createdTo }),
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
        // todo should make dynamic the fields
        fields: fields || fieldsDefault,
        limit: limit,
        offset: (page - 1) * limit,
        include: ["client", "state", "workCenter", "responsible", "activity"],
        order: "title ASC",
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
                "Error getting the budget information: ",
                err.response || err.request || err
            );
            throw err.response || err.request || err;
        });

    const total = await axios
        .get(`${API_URL}Budgets/listCount`, {
            params: { where: JSON.stringify(params.where) },
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
                "Error counting the budgets rows: ",
                err.response || err.request || err
            );
            throw err.response || err.request || err;
        });

    return { budgets: query, total: total.count };
}

export async function getBudget({ id }: { id: number }) {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}Budgets/getCompleteById?id=${id}`;

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
                "Error getting the budget information: ",
                err.response || err.request || err
            );
            throw err.response || err.request || err;
        });

    return query;
}

export async function getBudgetTracking({ id }: { id: number }) {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}Tracking/getTracking?model=Budget&modelId=${id}`;
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
                "Error getting the budget information: ",
                err.response || err.request || err
            );
            throw err.response || err.request || err;
        });

    return query;
}

export async function getBudgetAttachment({ id }: { id: number }) {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}AttachedFiles?`;
    const params = { filter: { where: { budgetId: id } } };

    const query = await axios
        .get(url, {
            params,
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
                "Error getting the budget attachments: ",
                err.response || err.request || err
            );
            throw err.response || err.request || err;
        });

    return query;
}
