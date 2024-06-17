import {
    FlatList,
    ListRenderItem,
    Pressable,
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
import {
    Attachment,
    getBudgetAttachments,
} from "../../../../api/budgets/budgets";
import Card from "../../../../components/Card/Card";
import { downLoadRemoteFile } from "../../../../services/files/files";
import Alert from "../../../../components/Alert/Alert";
import FAB from "../../../../components/FAB/FAB";
import { notificationToast } from "../../../../services/notifications/notifications";
import {
    deleteBudgetAttachment,
    uploadBudgetAttachment,
} from "../../../../api/attachments/attchments";

export default function Attachments() {
    const constants = Constants.expoConfig?.extra;
    const API_URL = constants?.API_URL;
    const API_URL_FRAGMENT = constants?.API_URL_FRAGMENT;
    const {
        contextParams: { budgetId },
    } = useContext(ParamsContext)!;
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();
    const { width, height } = useWindowDimensions();

    const [data, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<boolean>(false);
    const [alertConfig, setAlertConfig] = useState<{
        title: string;
        onAccept: () => Promise<void>;
    }>({ title: "", onAccept: async () => {} });

    const themedStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
        },
    });

    /**
     * function to get the budget attachments by budget ID
     */
    async function getAttachments() {
        const attachments = await getBudgetAttachments({ budgetId });
        setAttachments(attachments);
    }

    useEffect(() => {
        setLoading(true);
        (async () => {
            await getAttachments();
            setLoading(false);
        })();
    }, [budgetId]);

    /**
     * Asks the user to confirm an action before performing it.
     */
    function showConfirmDialog({
        text,
        onAccept,
    }: {
        text: string;
        onAccept: () => void;
    }) {
        setAlert(true);
        return setAlertConfig({
            title: text,
            onAccept: async () => onAccept(),
        });
    }

    /**
     * function to download one attachments to the device
     */
    async function downloadAttachment({
        fileName,
        url,
    }: {
        fileName: string;
        url: URL;
    }) {
        if (loading) return;
        setLoading(true);
        const downloaded = await downLoadRemoteFile({
            fileName,
            url,
        }).catch((e) => {
            notificationToast({
                text: t("fail-downloading-file"),
                type: "danger",
            });
            setLoading(false);
            return;
        });

        if (downloaded) {
            notificationToast({
                text: t("success-downloading-file"),
                type: "success",
            });
        }
        setLoading(false);
    }

    /**
     * function to delete one file
     */
    async function deleteAttachment({ id }: { id: number }) {
        if (loading) return;
        setLoading(true);
        const deleted = await deleteBudgetAttachment({ id }).catch((e) => {
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

            setAttachments((prevData) => {
                const objectIndex = prevData.findIndex((v) => v.id === id);
                return objectIndex !== -1
                    ? prevData.filter((v) => v.id !== id)
                    : prevData;
            });
        }
        setLoading(false);
    }

    /**
     * function to upload a new attachment to the api
     */
    async function uploadAttachment() {
        setLoading(true);
        const file = await uploadBudgetAttachment({ idBudget: budgetId }).catch(
            (err) =>
                notificationToast({
                    text: t("error-uploading-file"),
                    type: "danger",
                })
        );

        if (file) {
            notificationToast({
                text: t("file-successfully-uploaded"),
                type: "success",
            });
            setAttachments((prevData) => [...prevData, file]);
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
     * function component to render the attachment list item
     */
    const renderItem: ListRenderItem<Attachment> = ({ item }) => {
        return (
            <Card>
                <Pressable
                    onPress={() =>
                        showConfirmDialog({
                            text: `${t("wish-download-document")}: ${
                                item.name
                            }`,
                            onAccept: () =>
                                downloadAttachment({
                                    fileName: item.name,
                                    url: new URL(
                                        `${API_URL}containers/${API_URL_FRAGMENT}/download/${item.name}`
                                    ),
                                }),
                        })
                    }
                >
                    <Card.Body style={styles.cardBody}>
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
                        <View style={styles.actionButtonContainer}>
                            <Button
                                onPress={() =>
                                    showConfirmDialog({
                                        text: `${t("wish-delete-file")}: ${
                                            item.name
                                        }`,
                                        onAccept: () =>
                                            deleteAttachment({ id: item.id }),
                                    })
                                }
                                type="link"
                                buttonStyle={[
                                    styles.actionButton,
                                    {
                                        backgroundColor: loading
                                            ? theme.colors.primaryLight
                                            : theme.colors.primary,
                                    },
                                ]}
                                icon={
                                    <Icon
                                        source="close"
                                        size={20}
                                        color={theme.colors.primaryContrast}
                                    />
                                }
                            />
                        </View>
                    </Card.Body>
                </Pressable>
            </Card>
        );
    };

    return (
        <View style={[styles.container, themedStyles.container]}>
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
                style={[
                    styles.content,
                    {
                        flexDirection: width > height ? "row" : "column",
                        ...(width > height && { flexWrap: "wrap" }),
                    },
                ]}
            >
                <View
                    style={[
                        styles.buttonsContainer,
                        {
                            width: width > height ? "40%" : "100%",
                        },
                    ]}
                >
                    <Button
                        text={t("add-new-document")}
                        onPress={uploadAttachment}
                    />
                </View>
                {loading && data.length <= 0 ? (
                    <View style={styles.activityIndicator}>
                        <ActivityIndicator size={"large"} />
                    </View>
                ) : data.length > 0 ? (
                    <FlatList
                        style={[
                            styles.flatList,
                            {
                                ...(width < height && {
                                    width: "100%",
                                }),
                                height: width < height ? 500 : 250,
                            },
                        ]}
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                        refreshing={loading}
                        onRefresh={getAttachments}
                    />
                ) : (
                    <View style={styles.noAttachments}>
                        <Text>{t("budget-has-no-attachments")}.</Text>
                    </View>
                )}
            </View>
            <FAB onOpen={() => saveBudget()} primaryIcon={"content-save"}></FAB>
            <Alert
                title={alertConfig.title}
                onCloseModal={() => setAlert(false)}
                showModal={alert}
                type="confirm"
                showClose={false}
                onAccept={alertConfig.onAccept}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    buttonsContainer: {
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    cardBody: {
        flexDirection: "row",
        alignItems: "center",
    },
    noAttachments: {
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
    },
    activityIndicator: {
        justifyContent: "center",
        width: "100%",
    },
    flatList: {
        paddingHorizontal: 10,
    },
    actionButtonContainer: {
        position: "absolute",
        top: 0,
        right: 0,
    },
    actionButton: {
        borderTopStartRadius: 0,
        borderBottomEndRadius: 0,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
});
