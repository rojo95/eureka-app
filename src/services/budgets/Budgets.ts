import axios from "axios";
import { getSecureData } from "../storeData/storeData";
import Constants from "expo-constants";
import sessionNames from "../../utils/sessionInfo";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

export type Budgets = {
    activity: {
        activityTypeId: number;
        deletedAt?: Date | null;
        id: number;
        name: string;
        wcId: number;
    };
    activityId: number;
    client: {
        businessName?: string;
        cifNif: string;
        clientId?: number;
        code?: string | null;
        colorClient?: string | null;
        contasimpleId?: null;
        country?: string | null;
        createdAt: Date;
        customFields?: any | null;
        defaultAddressId?: number | null;
        defaultContactId?: number | null;
        defaultVatId?: number | null;
        deletedAt?: Date | null;
        domicile?: string | null;
        dueDateDays?: any | null;
        email?: string | null;
        externalId?: number | null;
        id: number;
        kMat?: number | null;
        kMo?: number | null;
        kOut?: number | null;
        ledgerAccountNumber?: number | null;
        locality?: string | null;
        name: string;
        notes?: any | null;
        number: string | number;
        numberOfDeadlines: number;
        paymentMethodId?: number | null;
        personType: string;
        profileImage?: string | null;
        province?: string | null;
        responsible?: string | null;
        salesLedgerAccountNumber?: number | null;
        tags?: any | null;
        telephone?: string | null;
        updatedAt: Date;
        userCreated?: Date | null;
        wcId: number;
        zip?: string | null;
    };
    clientId: number;
    createdAt: Date;
    discount: number;
    id: number;
    isActivityByAdministration: boolean;
    number: string;
    personnelResponsibleId: number;
    responsible: {
        active: boolean;
        activeDate: Date;
        address?: string | null;
        appVersion: string;
        bankAccount?: string | null;
        brigadeId?: number | null;
        categoryId?: number | null;
        clientCanAssign: boolean;
        country?: string | null;
        createdAt: Date;
        deletedAt?: Date | null;
        email: string;
        fullName: string;
        id: number;
        inactiveDate: Date;
        insuranceNumber?: number | null;
        lastAccessed: Date;
        lastName: string;
        locality?: string | null;
        modifiedAt: Date;
        name: string;
        nif: string;
        partTimeEmployee: boolean;
        personalEmail?: string | null;
        personalPhone?: string | null;
        profileImage?: string | null;
        signatureImage?: string | null;
        telephone?: string | null;
        type: string;
        username?: string | null;
        wcId: number;
        workCenters: number[];
        zip?: string | null;
    };
    state: { id: number; name: string; value: string };
    stateId: number;
    title: string;
    totalCost: number;
    totalSale: number;
    updatedAt: Date;
    wcId: number;
    workCenter: {
        a3CompanyCode: number;
        a3PurchasesAccount: number;
        a3SalesAccount: number;
        bankAccount: string;
        cifNif: string;
        contasimpleEmail: string;
        contasimpleIntegration: boolean;
        contasimplePassword: string;
        contasimpleToken?: string | null;
        country: string;
        customCounters: {
            budget: string;
            stockorder: string;
            work: string;
        };
        customPdf: {
            budgetCover: string;
            budgetResponsible: boolean;
            extraAvatar?: string | null;
            fontSize: number;
            footerColor: string;
            headerColor: string;
        };
        defaultSalesDocumentTypeId: number;
        defaultVatId: number;
        distanceCost: number;
        domicile: string;
        enabled: boolean;
        externalId?: number | null;
        extraHourPrice: number;
        hourPrice: number;
        hoursTypes: {
            normal: {
                value: number;
                enabled: boolean;
                hidden: boolean;
                label: string;
            };
            extra: {
                value: number;
                enabled: boolean;
                hidden: boolean;
                label: string;
            };
            night: {
                value: number;
                enabled: boolean;
                label: string;
                hidden: boolean;
            };
            fitosanitary: {
                value: number;
                enabled: boolean;
                label: string;
                hidden: boolean;
            };
        };
        id: number;
        incomeGoal?: string | null;
        invoiceTemplateModel: string;
        iva: number;
        legalTerms: string;
        locality: string;
        name: string;
        province: string;
        purchasesLedgerAccountNumber: string;
        salesLedgerAccountNumber: string;
        telephone: string;
        type: string;
        urlAvatar: string;
        wcId?: number | null;
        website: string;
        zip: string;
    };
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
}): Promise<{ budgets: Budgets[]; total: number }> {
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
 * @param {number} param.id
 * @returns
 */
export async function getBudget({ id }: { id: number }): Promise<Budgets> {
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
            throw err;
        });

    return query;
}

/**
 * Function to get te budget tracking by budget id
 * @param param0
 * @param {number} param.id
 * @returns
 */
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
            throw err;
        });

    return query;
}

/**
 * Function to get the budget Attachment by budget id
 * @param param0
 * @param {number} param.id
 * @returns
 */
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
            throw err;
        });

    return query;
}
