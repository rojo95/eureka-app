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
    const wcId = ((await getSecureData(idWc)) || "").split(",");
    const params = {
        filter: {
            where: {
                wcId: { inq: wcId },
                isActivityByAdministration: false,
                ...(client && { clients: client }),
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
                ...(states && { states: states }),
                ...(responsibles && { responsibles: responsibles }),
                ...(activities && { activities: activities }),
                ...(createdFrom && { createdFrom: createdFrom }),
                ...(createdTo && { createdTo: createdTo }),
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
            console.error("err getting the budget information: ", err.response);
            throw err.response;
        });

    const total = await axios
        .get(`${API_URL}Budgets/listCount`, {
            params: { where: JSON.stringify(params.filter.where) },
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
            console.error("err counting the budgets rows: ", err.response);
            throw err.response || err;
        });

    console.log(total);

    return { budgets: query, total };
}

// await fetch(
//     "https://pre.api.eurekacloud.es/api/Budgets/listCount?where=%7B%22wcId%22:%7B%22inq%22:%5B3%5D%7D,%22isActivityByAdministration%22:false%7D",
//     {
//         credentials: "include",
//         headers: {
//             "User-Agent":
//                 "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:126.0) Gecko/20100101 Firefox/126.0",
//             Accept: "application/json, text/plain, */*",
//             "Accept-Language": "es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3",
//             authorization:
//                 "mhPXDBKcQdIzIU5BbyLnFknWFyuF4eIiQ4B80VO9foMqvxx7j13txAi3SIzjXCE3",
//             "Sec-Fetch-Dest": "empty",
//             "Sec-Fetch-Mode": "cors",
//             "Sec-Fetch-Site": "same-site",
//             "If-None-Match": 'W/"d-xNCYsomkysM7H6BY3huMz0i6D+U"',
//         },
//         referrer: "https://pre.eurekacloud.es/",
//         method: "GET",
//         mode: "cors",
//     }
// );
