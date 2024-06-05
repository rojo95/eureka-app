import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { StorageAccessFramework } from "expo-file-system";
import Constants from "expo-constants";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";
import sessionNames from "../../utils/sessionInfo";
import { getSecureData } from "../storeData/storeData";

const AppDocsDir = FileSystem.cacheDirectory + "Eureka/";
const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
const API_URL_FRAGMENT = constants?.API_URL_FRAGMENT;
const { userKey } = sessionNames;

/**
 * function to generate the local file uri
 *
 * @param {string} fileName
 * @returns
 */
const generateFileUri = (fileName: string) => AppDocsDir + `${fileName}`;

/**
 * Function to generate the correct mime type by file
 * @param fileName
 * @returns
 */
const getMimeType = (fileName: string) => {
    const extension = fileName.split(".").pop();
    switch (extension) {
        case "pdf":
            return "application/pdf";
        case "doc":
            return "application/msword";
        case "docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        case "jpg":
        case "jpeg":
            return "image/jpeg";
        case "png":
            return "image/png";
        default:
            return "application/octet-stream";
    }
};

/**
 * Checks if directory exists. If not, creates it
 */
async function ensureDirExists() {
    const dirInfo = await FileSystem.getInfoAsync(AppDocsDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(AppDocsDir, {
            intermediates: true,
        });
    }
}

/**
 * Function to download the remote documents
 * @param param0
 * @param {string} param.documentName
 * @param {URL} param.url
 * @returns
 */
export async function downLoadRemoteDocument({
    documentName,
    url,
}: {
    documentName: string;
    url: URL;
}): Promise<boolean> {
    const { OS } = Platform;

    const options = {
        headers: {
            "Cache-Control": "no-store",
        },

        progressDownload: (written: any, total: any) => {
            console.log(`Downloaded ${written} of ${total}`);
        },

        resume: true,
    };

    if (OS !== "web") {
        try {
            await ensureDirExists();

            const fileUri = generateFileUri(documentName);

            const permissions =
                await StorageAccessFramework.requestDirectoryPermissionsAsync();
            if (!permissions.granted) {
                throw new Error(
                    "No permissions granted to access external storage"
                );
            }

            // temporary document storage
            const tempDownloadRes = await FileSystem.downloadAsync(
                url.toString(),
                fileUri,
                options
            );

            const { status } = tempDownloadRes;
            if (status === 400) {
                throw new Error("Error 400 Bad Request");
            } else if (status === 403) {
                throw new Error("Error 403 Access Denied");
            } else if (status !== 200) {
                throw new Error(`Error ${status}`);
            }

            // copy file to an accessible directory
            const docsDirectory = permissions.directoryUri;
            const fileName = documentName.split("/").pop();

            // Get file content
            const fileContent = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Create new file and write content
            const destinationFileUri =
                await StorageAccessFramework.createFileAsync(
                    docsDirectory,
                    fileName!,
                    getMimeType(fileName!)
                );
            await FileSystem.writeAsStringAsync(
                destinationFileUri,
                fileContent,
                {
                    encoding: FileSystem.EncodingType.Base64,
                }
            );

            // Delete temporary file
            await FileSystem.deleteAsync(fileUri);
            return true;
        } catch (e) {
            console.error(e);
            throw e;
        }
    } else {
        // TODO: should make the functionality to donwload the document at the pc
        return true;
    }
}

/**
 *Function to delete remote budget Document
 * @param param0
 * @param {number} param.id
 * @returns
 */
export async function deleteRemoteBudgetDocument({
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
                "Error deleting the document data: ",
                err.response || err.request || err
            );
            throw err.response || err.request || err;
        });

    return query;
}

export async function sendAttachmentBudget({
    idBudget,
}: {
    idBudget: number;
}): Promise<{ error?: boolean } | any> {
    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}AttachedFiles`;

    const document = await pickDocument();
    if (document) {
        const { uri, name, mimeType } = document!;
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
                    "Error syncronizing the document data: ",
                    err.response || err.request || err
                );
                console.log(err.response.data);
                throw err.response || err.request || err;
            });

        return query;
    } else return { error: true };
}

/**
 * function to pick the documents
 */
async function pickDocument() {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: "*/*", // Allow to select any kind of file
            copyToCacheDirectory: true,
        });

        if (result && !result.canceled && result.assets[0].name) {
            return result.assets[0];
        }
    } catch (err: any) {
        throw err.response || err.request || err;
    }
}

/**
 * function to upload files to Api
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
