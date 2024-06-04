import {
    FlatList,
    ListRenderItem,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Icon } from "react-native-paper";
import Toast from "react-native-root-toast";
import Constants from "expo-constants";
import AppHeader from "../../../../components/AppHeader/AppHeader";
import { DefaultTheme, useTheme } from "react-native-paper";
import Text from "../../../../components/Text/Text";
import Button from "../../../../components/Button/Button";
import { ParamsContext } from "../../../../contexts/SharedParamsProvider";
import { getBudgetAttachment } from "../../../../services/budgets/Budgets";
import CleanCard from "../../../../components/CleanCard/CleanCard";
import {
    deleteRemoteBudgetDocument,
    downLoadRemoteDocument,
    pickDocument,
} from "../../../../services/files/files";
import Alert from "../../../../components/Alert/Alert";
import FAB from "../../../../components/FAB/FAB";

export default function Attachments() {
    const {
        contextParams: { itemId },
    } = useContext(ParamsContext)!;
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();
    const constants = Constants.expoConfig?.extra;
    const API_URL = constants?.API_URL;
    const API_URL_FRAGMENT = constants?.API_URL_FRAGMENT;

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<boolean>(false);
    const [alertConfig, setAlertConfig] = useState<{
        title: string;
        accept: () => void;
    }>({ title: "", accept: () => {} });

    const themedStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.background,
        },
    });

    /**
     * function to get the budget attachments by ID
     */
    async function getAttachments() {
        const info = await getBudgetAttachment({ id: itemId });
        setData(info);
    }

    useEffect(() => {
        setLoading(true);
        getAttachments();
        setLoading(false);
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
            accept: () => accept(),
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
            Toast.show(`${t("fail-downloading-document")}.`, {
                backgroundColor: theme.colors.dangerIntense,
                duration: Toast.durations.LONG,
            });
            setLoading(false);
            return;
        });

        if (downloaded === true) {
            Toast.show(`${t("success-downloading-document")}.`, {
                backgroundColor: theme.colors.successIntense,
                duration: Toast.durations.LONG,
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
            Toast.show(`${t("fail-deleting-file")}.`, {
                backgroundColor: theme.colors.dangerIntense,
                duration: Toast.durations.LONG,
            });
            setLoading(false);
            return;
        });

        if (deleted?.count! > 0) {
            Toast.show(`${t("success-deleting-file")}.`, {
                backgroundColor: theme.colors.successIntense,
                duration: Toast.durations.LONG,
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
        await pickDocument();
    }

    async function saveBudget() {
        console.log("save budget data");
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
                    style={{
                        backgroundColor: "#fff",
                        minHeight: 90,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Icon
                        source="file-document-outline"
                        size={50}
                        color={
                            loading ? theme.colors.lightGrey : theme.colors.dark
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
                    <View style={{ position: "absolute", top: 0, right: 0 }}>
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
                </Pressable>
            </CleanCard>
        );
    };

    return (
        <View style={[styles.container, themedStyles.container]}>
            <AppHeader
                title={t("budget-details-title")}
                actions={[{ icon: "dots-vertical" }]}
                subtitle={t("attachments-label")}
            />
            <View style={styles.buttonsContainer}>
                <Button
                    text={t("add-new-document")}
                    onPress={uploadBudgetDocument}
                />
            </View>
            <View>
                {loading && data.length < 1 ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <View>
                        <View>
                            <FlatList
                                style={{
                                    width: "100%",
                                    paddingHorizontal: 10,
                                }}
                                data={data}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={renderItem}
                                refreshing={loading}
                                onRefresh={getAttachments}
                            />
                        </View>
                    </View>
                )}
            </View>
            <FAB onOpen={() => saveBudget()} primaryIcon={"content-save"}></FAB>
            <Alert
                title={alertConfig.title}
                closeModal={() => setAlert(false)}
                showModal={alert}
                type="confirm"
                showClose={false}
                accept={alertConfig.accept}
                cancel={() => setAlertConfig({ title: "", accept: () => {} })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonsContainer: {
        marginVertical: 30,
        marginHorizontal: 20,
    },
});
