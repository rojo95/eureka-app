import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import AppHeader from "../../../../components/AppHeader/AppHeader";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import FAB from "../../../../components/FAB/FAB";
import { Checkbox, DefaultTheme, useTheme } from "react-native-paper";
import { getBudget } from "../../../../services/budgets/Budgets";
import ItemCard from "../../../../components/ItemCard/ItemCard";
import { ParamsContext } from "../../../../contexts/SharedParamsProvider";
import { notificationToast } from "../../../../services/notifications/notifications";

type Item = {
    key: string;
    id: number;
    rank: string;
    description: string;
    totalCost: number;
    totalSale: number;
};

export default function Chapters() {
    const theme: DefaultTheme = useTheme();
    const { t } = useTranslation();

    const {
        contextParams: { itemId },
    } = useContext(ParamsContext)!;
    const navigation: any = useNavigation();
    const [loading, setLoading] = useState<boolean>(true);
    const [selection, setSelection] = useState<boolean>(false);
    const [data, setData] = useState<Item[]>([]);

    async function getChapters() {
        const info = await getBudget({ id: itemId });
        const chapters: Item[] = info?.chapters?.map((v: any, i: number) => ({
            key: `${i}`,
            id: v.id,
            rank: v.rank,
            description: v.description,
            totalCost: v.totalCost,
            totalSale: v.totalSale,
        }));
        setData(chapters);
        setLoading(false);
    }

    useEffect(() => {
        getChapters();
        return () => {
            setLoading(true);
        };
    }, [itemId]);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primaryContrast,
            flex: 1,
        },
        rowItem: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
        },
        text: {
            color: theme.colors.dark,
        },
        description: {
            fontSize: 14,
            fontWeight: "bold",
        },
        code: {
            fontSize: 13,
        },
    });

    function handleListUpdate(listItems: Item[]) {
        const settedList: Item[] = listItems.map((v, k) => {
            return { ...v, rank: `${k + 1}` };
        });
        setData(settedList);
    }

    useEffect(() => {
        if (!loading) {
            updateList();
        }

        return () => {};
    }, [data]);

    async function updateList() {
        notificationToast({
            text: t("function-soon"),
            type: "danger",
            position: "CENTER",
        });
    }

    const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
        return (
            <ScaleDecorator>
                <Pressable
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                        styles.rowItem,
                        {
                            backgroundColor: isActive
                                ? "#efefef"
                                : theme.colors.primaryContrast,
                        },
                    ]}
                >
                    {selection && <Checkbox status="checked" />}
                    <ItemCard
                        code={item.rank}
                        description={item.description}
                        cost={item.totalCost}
                        sale={item.totalSale}
                    />
                </Pressable>
            </ScaleDecorator>
        );
    };

    return (
        <View style={styles.container}>
            <AppHeader
                title={t("budget-details-title")}
                actions={[{ icon: "dots-vertical" }]}
                subtitle={t("chapters-label")}
                subtitleAction={[
                    {
                        text: !selection ? t("edit-list") : t("cancel-label"),
                        onAction: () => setSelection(!selection),
                    },
                ]}
            />
            {loading ? (
                <></>
            ) : (
                <View style={{ marginBottom: 150 }}>
                    <DraggableFlatList
                        data={data}
                        onDragEnd={({ data }) => {
                            handleListUpdate(data);
                        }}
                        keyExtractor={(item) => item.key}
                        renderItem={renderItem}
                    />
                </View>
            )}
            <View style={{ flex: 1, marginTop: "-150%" }}>
                <FAB
                    actions={[
                        {
                            icon: "download",
                            label: t("export-chapter-s"),
                            onPress: () => {
                                notificationToast({
                                    text: t("function-soon"),
                                    type: "danger",
                                    position: "CENTER",
                                });
                            },
                        },
                        {
                            icon: "upload",
                            label: t("import-chapter-s"),
                            onPress: () => {
                                notificationToast({
                                    text: t("function-soon"),
                                    type: "danger",
                                    position: "CENTER",
                                });
                            },
                        },
                        {
                            icon: "content-save",
                            label: t("save-label"),
                            onPress: () => {
                                notificationToast({
                                    text: t("function-soon"),
                                    type: "danger",
                                    position: "CENTER",
                                });
                            },
                        },
                    ]}
                />
            </View>
        </View>
    );
}
