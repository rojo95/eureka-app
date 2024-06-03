import {
    FlatList,
    ListRenderItem,
    Pressable,
    StyleSheet,
    View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "react-native-paper";
import AppHeader from "../../../../components/AppHeader/AppHeader";
import { DefaultTheme, useTheme } from "react-native-paper";
import Text from "../../../../components/Text/Text";
import Button from "../../../../components/Button/Button";
import { ParamsContext } from "../../../../contexts/SharedParamsProvider";
import { getBudgetAttachment } from "../../../../services/budgets/Budgets";
import CleanCard from "../../../../components/CleanCard/CleanCard";

export default function Attachments() {
    const {
        contextParams: { itemId },
    } = useContext(ParamsContext)!;
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

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
        console.log(info);
    }

    useEffect(() => {
        setLoading(true);
        async () => {
            await getAttachments();
            setLoading(false);
        };
        return () => {};
    }, [itemId]);

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
        console.log({ documentName, url });
    }

    async function deleteDocument({ id }: { id: number }) {
        console.log("delete document:", { id });
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
                        downLoadDocument({
                            documentName: item.name,
                            url: item.url,
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
                        color={theme.colors.dark}
                    />
                    <Text>{item.name}</Text>
                    <View style={{ position: "absolute", top: 0, right: 0 }}>
                        <Button
                            onPress={() => deleteDocument({ id: item.id })}
                            type="link"
                            buttonStyle={{
                                borderTopStartRadius: 0,
                                borderBottomEndRadius: 0,
                                backgroundColor: theme.colors.primary,
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
                <Button text="Agregar Archivo Nuevo" />
            </View>
            <View>
                <FlatList
                    style={{
                        width: "100%",
                        paddingHorizontal: 10,
                    }}
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            </View>
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
