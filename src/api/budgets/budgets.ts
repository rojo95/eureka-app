import axios from "axios";
import { getSecureData } from "../../services/store-data/store-data";
import Constants from "expo-constants";
import sessionNames from "../../utils/session-info";
import { Activity } from "../activities/activities";
import { Client } from "../clients/clients";
import { Personnel } from "../personnels/personnels";
import { BudgetState } from "../budget-states/budget-states";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

type HourType = {
    value: number;
    enabled: boolean;
    hidden: boolean;
    label: string;
};

type HoursTypes = {
    normal: HourType;
    extra: HourType;
    night: HourType;
    fitosanitary: HourType;
};

export type Tracking = {
    author: string;
    createdAt: Date;
    createdBy: string;
    date: Date;
    done: boolean;
    doneDate?: Date | null;
    id: number;
    notes: string;
    personnel: Personnel;
    type: number;
    updatedAt: Date;
};

type Place = {
    id: number;
    lat: number;
    lng: number;
    name: string;
};

interface Responsible extends Personnel {}

export type Budget = {
    activity: Activity;
    client: Client;
    createdAt: Date;
    id: number;
    number: string;
    responsible: Responsible;
    state: BudgetState;
    title: string;
    totalCost: number;
    totalSale: number;
    chapters: Chapter[];
    place: Place;
    totalHours: string;
};

export type Batches = {
    code?: string | null;
    rank: string;
    units: string;
    description: string;
    subText?: string | null;
    amount: number;
    moCost: number;
    costUd: number;
    totalCost: number;
    totalSale: number;
    imageUrl?: string | null;
    id: number;
    subBatches: Batches[];
};

export type Chapter = {
    description: string;
    rank: string;
    kMat: number;
    kMo: number;
    kOut: number;
    totalCost: number;
    totalSale: number;
    batches: Batches[];
};

export type Attachment = {
    budgetId: number;
    clientInvoiceId?: number | null;
    createdAt: Date;
    createdBy: number;
    description?: string | null;
    extraPersonnelId?: number | null;
    id: number;
    incomingId?: number | null;
    modifiedAt: Date;
    modifiedBy: number;
    name: string;
    orderId?: number | null;
    orderReturnId?: number | null;
    providerInvoiceId?: number | null;
    url: URL;
    workId?: number | null;
    workOrderId?: number | null;
};

/**
 * function to get the budgets list
 *
 * @param param0
 * @param { number } page
 * @param { number } limit
 * @param { string[] } fields
 * @param { string } textFilter
 * @param { number } client
 * @param { number[] } states
 * @param { number[] } responsibles
 * @param { number[] } activities
 * @param { Date } createdFrom
 * @param { Date } createdTo
 * @returns
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
}): Promise<{ budgets: Budget[]; total: number }> {
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
        // TODO: should make dynamic the fields
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
            throw err;
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
            throw err;
        });

    return { budgets: query, total: total.count };
}

/**
 * Function to get the budget details by id
 * @param param0
 * @param {number} param.budgetId
 * @returns
 */
export async function getBudget({
    budgetId,
}: {
    budgetId: number;
}): Promise<Budget> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}Budgets/getCompleteById?id=${budgetId}`;

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
            throw err;
        });

    return query;
}

/**
 * Function to get te budget tracking by budget id
 * @param param0
 * @param {number} param.budgetId
 * @returns
 */
export async function getBudgetTracking({
    budgetId,
}: {
    budgetId: number;
}): Promise<Tracking[]> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}Tracking/getTracking?model=Budget&modelId=${budgetId}`;
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
            throw err;
        });

    return query;
}

/**
 * Function to get the budget Attachment by budget id
 * @param param0
 * @param {number} param.budgetId
 * @returns
 */
export async function getBudgetAttachments({
    budgetId,
}: {
    budgetId: number;
}): Promise<Attachment[]> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}AttachedFiles?`;
    const params = { filter: { where: { budgetId } } };

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
            throw err;
        });

    return query;
}
