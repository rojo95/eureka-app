import axios from "axios";
import { getSecureData } from "../../services/store-data/store-data";
import Constants from "expo-constants";
import sessionNames from "../../utils/sessionInfo";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

type hoursTypes = {
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

type Activity = {
    activityTypeId: number;
    deletedAt?: Date | null;
    id: number;
    name: string;
    wcId: number;
};

type Client = {
    businessName?: string | null;
    cifNif: string;
    clientContacts: any[];
    clientId?: number | null;
    code?: string | null;
    colorClient?: string | null;
    contasimpleId?: string | null;
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
    notes?: string | null;
    number: string;
    numberOfDeadlines: number;
    paymentMethodId?: number | null;
    personType: string;
    profileImage?: string | null;
    province?: string | null;
    responsible?: any | null;
    salesLedgerAccountNumber?: number | null;
    tags?: any | null;
    telephone?: string | null;
    updatedAt: Date;
    userCreated?: Date | null;
    wcId: number;
    zip?: string | null;
};

export type Budget = {
    activity: Activity;
    activityId: number;
    client: Client;
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
        id: number;
        inactiveDate: Date;
        insuranceNumber?: number | null;
        lastAccessed: Date;
        lastName: string;
        fullName: string;
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
        username: string | null;
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
        hoursTypes: hoursTypes;
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
        budgetConfig: {
            budgetName: boolean;
            budgetNumber: boolean;
            clientAddress: boolean;
            clientDocumentId: boolean;
            clientName: boolean;
            createdAt: Date;
            date: boolean;
            defaultObservations: string;
            deletedAt?: Date | null;
            footer: string;
            footerCoverColor: string;
            id: number;
            kMat?: number | null;
            kMo: number;
            kOut: number;
            printCover: boolean;
            printCoverOption: string;
            templateModel: string;
            updatedAt: Date;
            wcId: number;
            workCenterDocumentId: boolean;
            workCenterLogo: boolean;
            workCenterName: boolean;
        };
    };
    brigadeToAssign?: any | null;
    budgetId: number;
    chapters: Chapter[];
    dateAt: Date;
    deletedAt?: Date | null;
    discountMat?: number | null;
    discountMo?: number | null;
    discountValue: number;
    draftWorkOrderDescription?: string | null;
    isDraft: boolean;
    kMat: number;
    kMo: number;
    kOut: number;
    matCost: number;
    matSale: number;
    moCost: number;
    moSale: number;
    notes: string;
    observations: string;
    outsourceCost: number;
    outsourceSale: number;
    place: {
        id: number;
        lat: number;
        lng: number;
        name: string;
    };
    placeId: number;
    revisionOf: {
        activityId: string;
        brigadeToAssign?: any | null;
        budgetId?: number | null;
        clientId: number;
        createdAt: Date;
        dateAt: Date;
        deletedAt?: Date | null;
        discount: number;
        discountMat?: number | null;
        discountMo?: number | null;
        draftWorkOrderDescription?: string | null;
        id: number;
        isActivityByAdministration: boolean;
        isDraft: boolean;
        kMat: number;
        kMo: number;
        kOut: number;
        matCost: number;
        matSale: number;
        moCost: number;
        moSale: number;
        notes: string;
        number: string;
        observations?: string | null;
        outsourceCost: number;
        outsourceSale: number;
        personnelResponsibleId: number;
        placeId: number;
        stateId: number;
        title: string;
        totalCost: number;
        totalSale: number;
        totalSaleDiscount?: number | null;
        updatedAt: Date;
        vat: number;
        vatId: number | null;
        version: number;
        wcId: number;
        workId?: number | null;
    };
    totalHours: string;
    totalSaleDiscount?: number | null;
    totalSaleWithoutDiscount: number;
    vat: number;
    vatId?: number | null;
    version: number;
    workId: number;
};

export interface Chapter {
    description: string;
    rank: string;
    kMat: number;
    kMo: number;
    kOut: number;
    totalCost: number;
    totalSale: number;
    budgetId: number;
    priceDatabaseId?: number | null;
    kMatModified?: any | null;
    kMoModified?: any | null;
    kOutModified?: any | null;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    articleDatabaseId?: number | null;
    batches: [
        {
            code?: string | null;
            rank: number;
            units: string;
            description: string;
            subText?: string | null;
            amount: number;
            minAmount: number;
            retailPrice: number;
            purchaseDiscounts?: number | null;
            matCost: number;
            outsourceCost: number;
            moCost: number;
            costUd: number;
            totalCost: number;
            saleDiscount: number;
            saleUd: number;
            totalSale: number;
            externalId?: number | null;
            imageUrl?: string | null;
            coefficient?: number | null;
            providerId?: number | null;
            forceSaleUd: boolean;
            saleUdWithoutDiscount: number;
            id: number;
            articleDatabaseBatchId?: number | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt?: number | null;
            chapterId: number;
            stockItemId?: number | null;
            stockOutgoingStockItemId?: number | null;
            providerBatches: [
                {
                    providerId?: number | null;
                    batchId: number;
                    selected: boolean;
                    matCost: number;
                    moCost: number;
                    outsourceCost: number;
                    id: number;
                    createdAt: Date;
                    updatedAt?: Date | null;
                    deletedAt?: Date | null;
                }
            ];
            subBatches: any[];
            matSale: number;
            outsourceSale: number;
            moSale: number;
            calcSaleUd: number;
        }
    ];
    matCost: number;
    outsourceCost: number;
    moCost: number;
    matSale: number;
    outsourceSale: number;
    moSale: number;
}

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
 *
 * @param param0
 * @param {number} param.budgetId
 * @returns
 */
export async function getBudgetChapters({ budgetId }: { budgetId: number }) {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}Budgets/getCompleteById?id=${budgetId}`;

    const query: Chapter[] = await axios
        .get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization,
            },
        })
        .then(async ({ request: { response } }) => {
            const BudgetComplete = JSON.parse(response);

            const chapters: Chapter[] = BudgetComplete.chapters;

            return chapters;
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
export async function getBudgetTracking({ budgetId }: { budgetId: number }) {
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
