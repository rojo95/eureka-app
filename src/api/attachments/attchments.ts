import axios from "axios";
import {
    getMimeType,
    pickDocument,
    restrictFileTypes,
} from "../../services/files/files";
import { getSecureData } from "../../services/store-data/store-data";
import Constants from "expo-constants";
import sessionNames from "../../utils/sessionInfo";
import { Attachment } from "../budgets/Budgets";

const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const API_URL_FRAGMENT = constants?.API_URL_FRAGMENT;
const { userKey } = sessionNames;

/**
 * Function to delete remote budget attachment
 * @param param0
 * @param {number} param.id
 * @returns
 */
export async function deleteBudgetAttachment({
    id,
}: {
    id: number;
}): Promise<{ count: number }> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}AttachedFiles/${id}`;

    const query = await axios
        .delete(url, {
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
                "Error deleting the attachment data: ",
                err.response || err.request || err
            );
            throw err.response || err.request || err;
        });

    return query;
}

/**
 * Function to send files to the api and append to the budget
 * @param param0
 * @param {number} param.idBudget
 * @returns
 */
export async function uploadBudgetAttachment({
    idBudget,
}: {
    idBudget: number;
}): Promise<Attachment> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}AttachedFiles`;

    const document = await pickDocument();
    if (document) {
        const { uri, name, mimeType } = document!;

        if (!restrictFileTypes({ name: name })) throw { error: true };
        const {
            result: {
                files: { file },
            },
        } = await uploadFileToApi({
            uri,
            name,
            mimeType: mimeType || getMimeType(name),
        });

        const {
            name: fileName,
            type: fileType,
            providerResponse: { location: urlFile },
        } = file[0];

        const query = await axios
            .put(
                url,
                {
                    name: fileName,
                    type: fileType,
                    budgetId: idBudget,
                    url: urlFile,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization,
                    },
                }
            )
            .then(async ({ request }) => {
                const response = JSON.parse(request.response);
                return response;
            })
            .catch((err) => {
                console.error(
                    "Error syncronizing the attachment data: ",
                    err.response || err.request || err
                );
                console.error(err.response.data);
                throw err.response || err.request || err;
            });

        return query;
    } else throw { error: true };
}

/**
 * function to upload files to the Api
 * @param param0
 * @param {string} param.name
 * @param {URL} param.uri
 */
async function uploadFileToApi({
    uri,
    name,
    mimeType,
}: {
    uri: string;
    name: string;
    mimeType: string;
}) {
    const url = `${API_URL}containers/${API_URL_FRAGMENT}/upload`;

    const formData: any = new FormData();

    formData.append("file", {
        uri,
        name,
        type: mimeType,
    });

    const headers = {
        "Content-Type": "multipart/form-data",
    };

    const resp = await fetch(url, {
        method: "post",
        body: formData,
        headers,
    })
        .then((res) => res.json())
        .then((res) => res)
        .catch((err) => {
            throw err;
        });

    return resp;
}
