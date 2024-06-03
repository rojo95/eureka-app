import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { StorageAccessFramework } from "expo-file-system";

const AppDocsDir = FileSystem.cacheDirectory + "Eureka/";

const generateFileUri = (fileName: string) => AppDocsDir + `${fileName}`;

// Checks if directory exists. If not, creates it
async function ensureDirExists() {
    const dirInfo = await FileSystem.getInfoAsync(AppDocsDir);
    if (!dirInfo.exists) {
        console.log("Gif directory doesn't exist, creating…");
        await FileSystem.makeDirectoryAsync(AppDocsDir, {
            intermediates: true,
        });
    }
}

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
                    "No se otorgaron permisos para acceder al almacenamiento externo"
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
                    "image/jpeg"
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
