import {
    FlatList,
    ListRenderItem,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
    useWindowDimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Icon } from "react-native-paper";
import Constants from "expo-constants";
import AppHeader from "../../../../components/AppHeader/AppHeader";
import { DefaultTheme, useTheme } from "react-native-paper";
import Text from "../../../../components/Text/Text";
import Button from "../../../../components/Button/Button";
import { ParamsContext } from "../../../../contexts/SharedParamsProvider";
import { getBudgetAttachment } from "../../../../services/budgets/Budgets";
import CleanCard from "../../../../components/Card/Card";
import {
    deleteRemoteBudgetDocument,
    downLoadRemoteDocument,
    sendAttachmentBudget,
} from "../../../../services/files/files";
import Alert from "../../../../components/Alert/Alert";
import FAB from "../../../../components/FAB/FAB";
import { notificationToast } from "../../../../services/notifications/notifications";

export default function Attachments() {
    const constants = Constants.expoConfig?.extra;
    const API_URL = constants?.API_URL;
    const API_URL_FRAGMENT = constants?.API_URL_FRAGMENT;
    const {
        contextParams: { itemId },
    } = useContext(ParamsContext)!;
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();
    const { width, height } = useWindowDimensions();

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<boolean>(false);
    const [alertConfig, setAlertConfig] = useState<{
        title: string;
        accept: () => Promise<void>;
    }>({ title: "", accept: async () => {} });

    const themedStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
        },
    });

    /**
     * function to get the budget attachments by ID
     */
    async function getAttachments() {
        setLoading(true);
        const info = await getBudgetAttachment({ id: itemId });
        setData(info);
        setLoading(false);
    }

    useEffect(() => {
        async () => {
            await getAttachments();
        };
        return () => {};
    }, [itemId]);

    /**
     * function to ask if the user want to download a document
     * @param param0
     * @returns
     */
    async function askFunction({
        text,
        accept,
    }: {
        text: string;
        accept: () => void;
    }) {
        setAlert(true);
        return setAlertConfig({
            title: text,
            accept: async () => accept(),
        });
    }

    /**
     * funciton to download documents
     * @param param0
     * @param {string} param.documentName
     * @param {URL} param.url
     */
    async function downLoadDocument({
        documentName,
        url,
    }: {
        documentName: string;
        url: URL;
    }) {
        if (loading) return;
        setLoading(true);
        const downloaded = await downLoadRemoteDocument({
            documentName,
            url,
        }).catch((e) => {
            notificationToast({
                text: t("fail-downloading-document"),
                type: "danger",
            });
            setLoading(false);
            return;
        });

        if (downloaded === true) {
            notificationToast({
                text: t("success-downloading-document"),
                type: "success",
            });
        }
        setLoading(false);
    }

    /**
     * function to delete one file
     * @param param0
     * @param {number} param.id
     * @returns
     */
    async function deleteDocument({ id }: { id: number }) {
        if (loading) return;
        setLoading(true);
        const deleted = await deleteRemoteBudgetDocument({ id }).catch((e) => {
            notificationToast({
                text: t("fail-deleting-file"),
                type: "danger",
            });
            setLoading(false);
            return;
        });

        if (deleted?.count! > 0) {
            notificationToast({
                text: t("success-deleting-file"),
                type: "success",
            });

            setData((prevData) => {
                const objectIndex = prevData.findIndex((v) => v.id === id);
                return objectIndex !== -1
                    ? prevData.filter((v) => v.id !== id)
                    : prevData;
            });
        }
        setLoading(false);
    }

    async function uploadBudgetDocument() {
        setLoading(true);
        const file = await sendAttachmentBudget({ idBudget: itemId }).catch(
            (err) =>
                notificationToast({
                    text: t("error-uploading-file"),
                    type: "danger",
                })
        );

        if (file) {
            if (file.error) {
                notificationToast({
                    text: t("error-uploading-file"),
                    type: "danger",
                });
            } else {
                notificationToast({
                    text: t("file-successfully-uploaded"),
                    type: "success",
                });
                setData((prevData) => [
                    ...prevData,
                    { name: file.name, id: file.id },
                ]);
            }
        }
        setLoading(false);
    }

    async function saveBudget() {
        notificationToast({
            text: t("function-soon"),
            type: "danger",
            position: "CENTER",
        });
    }

    /**
     * function component to render the item list document
     * @returns
     */
    const renderItem: ListRenderItem<any> = ({ item }) => {
        return (
            <CleanCard>
                <Pressable
                    onPress={() =>
                        askFunction({
                            text: `${t("wish-download-document")}: ${
                                item.name
                            }`,
                            accept: () =>
                                downLoadDocument({
                                    documentName: item.name,
                                    url: new URL(
                                        `${API_URL}containers/${API_URL_FRAGMENT}/download/${item.name}`
                                    ),
                                }),
                        })
                    }
                >
                    <CleanCard.Body
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Icon
                            source="file-document-outline"
                            size={50}
                            color={
                                loading
                                    ? theme.colors.lightGrey
                                    : theme.colors.dark
                            }
                        />
                        <Text
                            style={{
                                color: loading
                                    ? theme.colors.lightGrey
                                    : theme.colors.dark,
                            }}
                        >
                            {item.name}
                        </Text>
                        <View
                            style={{ position: "absolute", top: 0, right: 0 }}
                        >
                            <Button
                                onPress={() =>
                                    askFunction({
                                        text: `${t("wish-delete-file")}: ${
                                            item.name
                                        }`,
                                        accept: () =>
                                            deleteDocument({ id: item.id }),
                                    })
                                }
                                type="link"
                                buttonStyle={{
                                    borderTopStartRadius: 0,
                                    borderBottomEndRadius: 0,
                                    backgroundColor: loading
                                        ? theme.colors.primaryLight
                                        : theme.colors.primary,
                                    width: 30,
                                    height: 30,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                                icon={
                                    <Icon
                                        source="close"
                                        size={20}
                                        color={theme.colors.primaryContrast}
                                    />
                                }
                            />
                        </View>
                    </CleanCard.Body>
                </Pressable>
            </CleanCard>
        );
    };

    return (
        <View style={[{ flex: 1 }, themedStyles.container]}>
            <View>
                <AppHeader
                    title={
                        width > height
                            ? t("attachments-label")
                            : t("budget-details-title")
                    }
                    actions={[{ icon: "dots-vertical" }]}
                    subtitle={width < height ? t("attachments-label") : ""}
                />
            </View>
            <View
                style={{
                    flexDirection: width > height ? "row" : "column",
                    ...(width > height && { flexWrap: "wrap" }),
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                }}
            >
                <View
                    style={{
                        paddingVertical: 40,
                        paddingHorizontal: 20,
                        width: width > height ? "40%" : "100%",
                    }}
                >
                    <Button
                        text={t("add-new-document")}
                        onPress={uploadBudgetDocument}
                    />
                </View>
                {loading ? (
                    <View style={{ justifyContent: "center", width: "100%" }}>
                        <ActivityIndicator size={"large"} />
                    </View>
                ) : (
                    <FlatList
                        style={{
                            paddingHorizontal: 10,
                            ...(width < height && {
                                width: "100%",
                            }),
                            height: width < height ? 500 : 250,
                        }}
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        refreshing={loading}
                        onRefresh={getAttachments}
                    />
                )}
            </View>
            <FAB onOpen={() => saveBudget()} primaryIcon={"content-save"}></FAB>
            <Alert
                title={alertConfig.title}
                onCloseModal={() => setAlert(false)}
                showModal={alert}
                type="confirm"
                showClose={false}
                onAccept={alertConfig.accept}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonsContainer: {
        height: "100%",
        marginVertical: 30,
        marginHorizontal: 20,
    },
});
