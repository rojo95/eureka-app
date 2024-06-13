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

/**
 * The type `Tracking` defines properties related to tracking tasks or activities.
 * @property {string} author - The `author` property in the `Tracking` type represents the name of the
 * person who authored or created the tracking entry.
 * @property {Date} createdAt - The `createdAt` property in the `Tracking` type represents the date and
 * time when the tracking entry was created. It is of type `Date`, indicating the timestamp of when the
 * entry was initially added to the system.
 * @property {string} createdBy - The `createdBy` property in the `Tracking` type represents the user
 * who created the tracking entry. It is a string type in the `Tracking` type definition.
 * @property {Date} date - The `date` property in the `Tracking` type represents the date associated
 * with the tracking information. It is of type `Date`, which means it stores a specific point in time
 * including the date and time information.
 * @property {boolean} done - The `done` property in the `Tracking` type indicates whether a task or
 * activity has been completed. It is a boolean value, meaning it can be either `true` (indicating the
 * task is done) or `false` (indicating the task is not done yet).
 * @property {Date | null} doneDate - The `doneDate` property in the `Tracking` type is a optional
 * property that can be either a `Date` or `null`. This property is used to store the date when the
 * tracking task was marked as done.
 * @property {number} id - The `id` property in the `Tracking` type represents a unique identifier for
 * the tracking entry. It is of type `number`.
 * @property {string} notes - The `notes` property in the `Tracking` type represents a string that
 * contains any additional information or comments related to the tracking data. It is used to store
 * textual information that may be relevant to the tracking record.
 * @property {Personnel} personnel - The `personnel` property in the `Tracking` type is of type
 * `Personnel`. It seems like the `Personnel` type is not defined in the code snippet you provided. If
 * you need further assistance with defining the `Personnel` type or accessing its properties, please
 * provide more information
 * @property {number} type - The `type` property in the `Tracking` type is a number. It represents a
 * specific type or category associated with the tracking data.
 * @property {Date} updatedAt - The `updatedAt` property in the `Tracking` type represents the date and
 * time when the tracking information was last updated. It is of type `Date`.
 */
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

/**
 * The type `Place` defines a structure with properties for id, latitude, longitude, and name.
 * @property {number} id - The `id` property in the `Place` type represents a unique identifier for a
 * place. It is of type `number`.
 * @property {number} lat - The `lat` property in the `Place` type represents the latitude coordinate
 * of a location on Earth. It is a number value that specifies how far north or south a point is from
 * the equator.
 * @property {number} lng - The `lng` property in the `Place` type represents the longitude coordinate
 * of a location. Longitude is a geographic coordinate that specifies the east-west position of a point
 * on the Earth's surface.
 * @property {string} name - The `name` property in the `Place` type represents the name of a location
 * or place.
 */
type Place = {
    id: number;
    lat: number;
    lng: number;
    name: string;
};

/* The above code is defining an interface named `Responsible` that extends another interface named
`Personnel`. This means that the `Responsible` interface will inherit all properties and methods
from the `Personnel` interface. */
interface Responsible extends Personnel {}

/**
 * The type `Budget` represents a budget object with various properties related to activities, clients,
 * responsible parties, state, title, costs, chapters, place, and hours.
 * @property {Activity} activity - The `activity` property in the `Budget` type represents the type of
 * activity or project associated with the budget. It is likely an object of type `Activity` that
 * contains information about the specific activity or project being budgeted for.
 * @property {Client} client - The `client` property in the `Budget` type represents the client
 * associated with the budget. It likely contains information about the client such as their name,
 * contact details, and any other relevant information related to the client.
 * @property {Date} createdAt - The `createdAt` property in the `Budget` type represents the date when
 * the budget was created. It is of type `Date`, which stores the date and time information.
 * @property {number} id - The `id` property in the `Budget` type represents a unique identifier for
 * the budget. It is of type `number`.
 * @property {string} number - The `number` property in the `Budget` type represents a unique
 * identifier for the budget. It is of type `string`.
 * @property {Responsible} responsible - The `responsible` property in the `Budget` type refers to an
 * object of type `Responsible`. This object likely contains information about the individual or team
 * responsible for managing or overseeing the budget. The specific properties of the `Responsible` type
 * would define the details such as name, contact information
 * @property {BudgetState} state - The `state` property in the `Budget` type represents the state of
 * the budget, which is of type `BudgetState`. This property indicates the current status or stage of
 * the budget, such as draft, pending approval, approved, rejected, etc.
 * @property {string} title - The `title` property in the `Budget` type represents the title or name of
 * the budget. It is a string type property.
 * @property {number} totalCost - The `totalCost` property in the `Budget` type represents the total
 * cost associated with the budget. It is a numeric value (number) that indicates the total cost of the
 * budget, which could include expenses, fees, or any other financial aspects related to the budget.
 * @property {number} totalSale - The `totalSale` property in the `Budget` type represents the total
 * amount of sales for the budget. It is a numeric value (number) indicating the total sales amount
 * associated with the budget.
 * @property {Chapter[]} chapters - The `chapters` property in the `Budget` type is an array of
 * `Chapter` objects. Each `Chapter` object likely contains information related to a specific section
 * or division of the budget, such as costs, hours, or tasks associated with that chapter.
 * @property {Place} place - The `place` property in the `Budget` type represents the location or venue
 * associated with the budget. It could be a physical location where the activities outlined in the
 * budget will take place, such as a conference center, office building, or event venue.
 * @property {string} totalHours - The `totalHours` property in the `Budget` type represents the total
 * number of hours associated with the budget. It is of type `string`.
 */
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

/**
 * The type `Batches` defines a structure with various properties for representing batches of items.
 * @property {string | null} code - The `code` property in the `Batches` type is a string that can be
 * `null`.
 * @property {string} rank - The `rank` property in the `Batches` type represents the rank of a batch.
 * It is a string type in the type definition.
 * @property {string} units - The `units` property in the `Batches` type represents the units
 * associated with a batch. It is a string type in the `Batches` type definition.
 * @property {string} description - The `description` property in the `Batches` type represents a
 * string that describes the batch or item. It provides information about the batch or item's
 * characteristics, features, or any other relevant details.
 * @property {string | null} subText - The `subText` property in the `Batches` type is a string that
 * can be optional (either a string or null).
 * @property {number} amount - The `amount` property in the `Batches` type represents the quantity or
 * number of units in a batch. It is a numeric value (number) indicating the amount of units present in
 * that particular batch.
 * @property {number} moCost - The `moCost` property in the `Batches` type represents the manufacturing
 * cost for a batch.
 * @property {number} costUd - The `costUd` property in the `Batches` type represents the cost per unit
 * of a batch.
 * @property {number} totalCost - The `totalCost` property in the `Batches` type represents the total
 * cost of a batch, which is a numerical value (number data type).
 * @property {number} totalSale - The `totalSale` property in the `Batches` type represents the total
 * sale amount for a batch. It is a number type property in the `Batches` type definition.
 * @property {string | null} imageUrl - The `imageUrl` property in the `Batches` type represents a URL
 * pointing to an image associated with the batch. It is optional and can be either a string containing
 * the URL or `null`.
 * @property {number} id - The `id` property in the `Batches` type represents a unique identifier for
 * each batch.
 * @property {Batches[]} subBatches - The `subBatches` property in the `Batches` type is an array of
 * objects of the same type `Batches`. This allows for nesting batches within batches, creating a
 * hierarchical structure. Each `Batches` object can have its own `subBatches` array, allowing for a
 */
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

/**
 * The type `Chapter` represents a chapter with various properties related to its description, rank,
 * costs, sales, and batches.
 * @property {string} description - A brief description of the chapter.
 * @property {string} rank - The `rank` property in the `Chapter` type represents the rank of the
 * chapter. It is a string type.
 * @property {number} kMat - The `kMat` property in the `Chapter` type represents the cost of materials
 * for that particular chapter.
 * @property {number} kMo - The `kMo` property in the `Chapter` type represents a numerical value that
 * is associated with the chapter. It is used to store a specific value related to the chapter, but
 * without more context, it's difficult to provide a more specific explanation.
 * @property {number} kOut - The `kOut` property in the `Chapter` type represents a number value. It is
 * used to store a specific value related to the chapter.
 * @property {number} totalCost - The `totalCost` property in the `Chapter` type represents the total
 * cost associated with that particular chapter. It is a numeric value (number) that indicates the
 * overall cost incurred for that chapter.
 * @property {number} totalSale - The `totalSale` property in the `Chapter` type represents the total
 * sales amount for a specific chapter. It likely stores the total revenue generated from selling
 * products or services associated with that chapter.
 * @property {Batches[]} batches - The `batches` property in the `Chapter` type is an array of objects
 * of type `Batches`. Each object in the array represents a batch of items related to the chapter.
 */
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

/**
 * The type `Attachment` defines properties related to attachments in a budget, including IDs, dates,
 * descriptions, and URLs.
 * @property {number} budgetId - The `budgetId` property in the `Attachment` type represents the unique
 * identifier of the budget associated with the attachment.
 * @property {number | null} clientInvoiceId - The `clientInvoiceId` property in the `Attachment` type
 * represents the ID of the client invoice associated with the attachment. It is optional and can be
 * either a number or null.
 * @property {Date} createdAt - The `createdAt` property in the `Attachment` type represents the date
 * and time when the attachment was created. It is of type `Date`, indicating the timestamp of the
 * creation of the attachment.
 * @property {number} createdBy - The `createdBy` property in the `Attachment` type represents the user
 * ID of the individual who created the attachment. It is a required field and must be a number.
 * @property {string | null} description - The `description` property in the `Attachment` type is a
 * string that provides additional information or details about the attachment. It is optional and can
 * be `null` if no description is provided for the attachment.
 * @property {number | null} extraPersonnelId - The `extraPersonnelId` property in the `Attachment`
 * type represents the ID of any additional personnel associated with the attachment. It is optional
 * and can be either a number or null.
 * @property {number} id - The `id` property in the `Attachment` type represents a unique identifier
 * for the attachment. It is of type `number`.
 * @property {number | null} incomingId - The `incomingId` property in the `Attachment` type represents
 * the ID of the incoming attachment associated with the attachment. It is an optional field that can
 * hold a number value or be null.
 * @property {Date} modifiedAt - The `modifiedAt` property in the `Attachment` type represents the date
 * and time when the attachment was last modified. It is of type `Date`, indicating the timestamp of
 * the modification.
 * @property {number} modifiedBy - The `modifiedBy` property in the `Attachment` type represents the
 * user ID of the person who last modified the attachment. It is a number data type.
 * @property {string} name - The `name` property in the `Attachment` type represents the name of the
 * attachment. It is a required field and should be a string value.
 * @property {number | null} orderId - The `orderId` property in the `Attachment` type represents the
 * ID of an order associated with the attachment. It is a number type that can be `null`.
 * @property {number | null} orderReturnId - The `orderReturnId` property in the `Attachment` type
 * represents the ID of the order return associated with the attachment. It is a number type that can
 * be `null` if not applicable.
 * @property {number | null} providerInvoiceId - The `providerInvoiceId` property in the `Attachment`
 * type represents the unique identifier of the provider invoice associated with the attachment. It is
 * of type `number` or `null`, indicating that it may or may not have a value assigned to it.
 * @property {URL} url - The `url` property in the `Attachment` type represents a URL data type. It is
 * used to store a reference to a Uniform Resource Locator (URL) which can be used to locate a resource
 * on the internet or within a network.
 * @property {number | null} workId - The `workId` property in the `Attachment` type represents the
 * identifier of the work associated with the attachment. It is a number type and can be `null`.
 * @property {number | null} workOrderId - The `workOrderId` property in the `Attachment` type
 * represents the ID of the work order associated with the attachment. It is a number type and can be
 * `null` if not applicable.
 */
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
 * The function `getBudgets` retrieves budget information based on specified criteria and returns the
 * budgets along with the total count.
 * @param param0
 * @param { number } param.page
 * @param { number } param.limit
 * @param { string[] } param.fields
 * @param { string } param.textFilter
 * @param { number } param.client
 * @param { number[] } param.states
 * @param { number[] } param.responsibles
 * @param { number[] } param.activities
 * @param { Date } param.createdFrom
 * @param { Date } param.createdTo
 * - The `getBudgets` function is an asynchronous function that retrieves budgets based on
 * various filter criteria.
 * @returns {Promise<{ budgets: Budget[]; total: number }>} The function `getBudgets` returns a Promise that resolves to an object with two properties:
 * 1. `budgets`: An array of Budget objects that match the specified criteria.
 * 2. `total`: The total count of budgets that match the specified criteria.
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
 * This TypeScript function retrieves budget information by making a secure API call with the provided
 * budget ID.
 * @param param0
 * @param {number} param.budgetId
 * - The `getBudget` function is an asynchronous function that retrieves budget information
 * from an API endpoint. It takes an object as a parameter with a `budgetId` property of type number.
 * The function then uses the `budgetId` to construct a URL for the API request.
 * @returns {Promise<Budget>} The function `getBudget` is returning the budget information fetched from the API based on
 * the provided `budgetId`.
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
 * This TypeScript function retrieves budget tracking data by making a GET request to a specific API
 * endpoint.
 * @param param0
 * @param {number} param.budgetId
 * - The `getBudgetTracking` function is an asynchronous function that takes an object as a
 * parameter with a property `budgetId` of type number. It makes a request to an API endpoint to fetch
 * tracking information related to a specific budget identified by the `budgetId`.
 * @returns {Promise<Tracking[]>} The `getBudgetTracking` function is returning a Promise that resolves to an array of
 * `Tracking` objects.
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
 * This TypeScript function retrieves budget attachments by making a GET request to a specific API
 * endpoint with the provided budgetId.
 * @param param0
 * @param {number} param.budgetId
 * - The `getBudgetAttachments` function is an asynchronous function that retrieves budget
 * attachments from an API based on the provided `budgetId`.
 * @returns {Promise<Attachment[]>} The `getBudgetAttachments` function is returning a Promise that resolves to an array of
 * `Attachment` objects.
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
