import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { StorageAccessFramework } from "expo-file-system";
import Constants from "expo-constants";
import sessionNames from "../../utils/sessionInfo";
import { getSecureData } from "../storeData/storeData";
import axios from "axios";

const AppDocsDir = FileSystem.cacheDirectory + "Eureka/";
const constants = Constants.expoConfig?.extra;
const API_URL = constants?.API_URL;
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

export async function deleteRemoteBudgetDocument({
    id,
}: {
    id: number;
}): Promise<{ count: number }> {
    console.log("deletong");

    const Authorization = await getSecureData(userKey);
    const url = `${API_URL}AttachedFiles/${id}`;
    console.log(id);
    console.log(url);

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
    console.log(query);

    return query;
}
