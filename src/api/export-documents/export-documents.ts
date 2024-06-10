import { createUrl } from "../../utils/functions";
import Constants from "expo-constants";
import sessionNames from "../../utils/sessionInfo";
import { getSecureData } from "../../services/store-data/store-data";
import { setDateFormat } from "../../utils/numbers";
import axios from "axios";
import { Language } from "../../contexts/UserContext";
import { downLoadRemoteFile } from "../../services/files/files";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const { userKey, wcId: idWc } = sessionNames;

interface ItemInterface {
    id: number;
    name: string;
}

/**
 * function to download budgets
 * @param param0
 * @param { string } param.textFilter
 * @param { ItemInterface } param.client
 * @param { ItemInterface[] } param.states
 * @param { ItemInterface[] } param.responsibles
 * @param { ItemInterface[] } param.activities
 * @param { Date } param.createdFrom
 * @param { Date } param.createdTo
 * @param { any } param.translation
 * @returns
 */
export async function exportBudgets({
    textFilter,
    client,
    states,
    responsibles,
    activities,
    createdFrom,
    createdTo,
    translation,
    language,
}: {
    textFilter?: string;
    client?: ItemInterface;
    states?: ItemInterface[];
    responsibles?: ItemInterface[];
    activities?: ItemInterface[];
    createdFrom?: Date;
    createdTo?: Date;
    translation: any;
    language: Language;
}) {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}Personnels/exportViewAsExcel`;
    const wcId = ((await getSecureData(idWc)) || "")
        .split(",")
        .map((v) => parseInt(v));

    const params = {
        config: {
            filters: [
                ...[
                    client && {
                        value: client.id,
                        text: client.name,
                        filterName: translation("client-label"),
                    },
                ],
                ...[
                    states && {
                        value: states.map((v) => v.id),
                        text: states.map((v) => v.name),
                        filterName: translation("state-label"),
                    },
                ],
                ...[
                    activities && {
                        value: activities.map((v) => v.id),
                        text: activities.map((v) => v.name),
                        filterName: translation("activity-label"),
                    },
                ],
                ...[
                    createdFrom && {
                        value: createdFrom,
                        text: setDateFormat({
                            date: new Date(createdFrom),
                            language,
                        }),
                        filterName: translation("created-from"),
                    },
                ],
                ...[
                    createdTo && {
                        value: createdTo,
                        text: setDateFormat({
                            date: new Date(createdTo),
                            language,
                        }),
                        filterName: translation("created-to"),
                    },
                ],
            ].filter(Boolean),
            // TODO: should make dynamic the columns
            columns: [
                {
                    key: "number",
                    translate: "Nº",
                    excelBold: null,
                    excelNumFmt: null,
                    excelTotalize: null,
                    isDate: null,
                },
                {
                    key: "state.name",
                    translate: "Estado",
                    excelBold: null,
                    excelNumFmt: null,
                    excelTotalize: null,
                    isDate: null,
                },
                {
                    key: "title",
                    translate: "Nombre",
                    excelBold: null,
                    excelNumFmt: null,
                    excelTotalize: null,
                    isDate: null,
                },
                {
                    key: "client.businessName",
                    translate: "Cliente",
                    excelBold: null,
                    excelNumFmt: null,
                    excelTotalize: null,
                    isDate: null,
                },
                {
                    key: "responsible.fullName",
                    translate: "Responsable",
                    excelBold: null,
                    excelNumFmt: null,
                    excelTotalize: null,
                    isDate: null,
                },
                {
                    key: "activity.name",
                    translate: "Actividad",
                    excelBold: null,
                    excelNumFmt: null,
                    excelTotalize: null,
                    isDate: null,
                },
                {
                    key: "totalCost",
                    translate: "Coste",
                    excelBold: null,
                    excelNumFmt: "0.00€",
                    excelTotalize: true,
                    isDate: null,
                },
                {
                    key: "totalSale",
                    translate: "Venta",
                    excelBold: null,
                    excelNumFmt: "0.00€",
                    excelTotalize: true,
                    isDate: null,
                },
                {
                    key: "createdAt",
                    translate: "Creado",
                    excelBold: null,
                    excelNumFmt: null,
                    excelTotalize: null,
                    isDate: null,
                },
                {
                    key: "updatedAt",
                    translate: "Actualizado",
                    excelBold: null,
                    excelNumFmt: null,
                    excelTotalize: null,
                    isDate: null,
                },
            ],
            translate: translation("menu-title-budgets").toUpperCase(),
            headerColor: "FFB3CAC7",
        },
        filter: {
            where: {
                equal: {
                    clientId: -1,
                    stateId: -1,
                },
                ...(textFilter && { search: `%${textFilter}%` }),
                ...(states && { states: states.map((v) => v.id) }),
                ...(client && { clients: client.id }),
                ...(createdTo && { createdTo: createdTo }),
                ...(activities && { activities: activities.map((v) => v.id) }),
                ...(createdFrom && { createdFrom: createdFrom }),
                ...(responsibles && {
                    responsibles: responsibles.map((v) => v.id),
                }),
                isActivityByAdministration: false,
                wcId: { inq: wcId },
            },
            method: "list",
            include: [
                "client",
                "state",
                "workCenter",
                "responsible",
                "activity",
            ],
        },
        model: "Budget",
    };

    const query = await axios
        .get(url, {
            params: params,
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
                "err getting the budget excel: ",
                err.response || err.request || err
            );
            throw err;
        });

    const { document } = query;

    const paramsDocument = {
        type: "listado",
        documentID: document,
        access_token: Authorization,
    };

    const url_document = new URL(`${API_URL}WorkOrders/download`);
    const finalUrl = new URL(
        createUrl({
            urlBase: url_document,
            params: paramsDocument,
        })
    );

    return await downLoadRemoteFile({
        fileName: document,
        url: finalUrl,
    });
}
