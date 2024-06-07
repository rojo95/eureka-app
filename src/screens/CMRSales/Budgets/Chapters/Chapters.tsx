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
import ItemCard from "./components/ItemCard/ItemCard";
import { ParamsContext } from "../../../../contexts/SharedParamsProvider";
import { notificationToast } from "../../../../services/notifications/notifications";

export type ItemChapter = {
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
    const [data, setData] = useState<ItemChapter[]>([]);

    async function getChapters() {
        const info = await getBudget({ id: itemId });
        const chapters: ItemChapter[] = info?.chapters?.map(
            (v: ItemChapter, i: number) => ({
                ...v,
                key: `${i}`,
            })
        );
        setData(chapters);
        setLoading(false);
    }

    useEffect(() => {
        getChapters();
        return () => {
            setLoading(true);
        };
    }, [itemId]);

    const themedStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primaryContrast,
        },
    });

    function handleListUpdate(listItems: ItemChapter[]) {
        const settedList: ItemChapter[] = listItems.map((v, k) => {
            return { ...v, rank: `${k + 1}` };
        });
        setData(settedList);
    }

    async function saveChanges() {
        notificationToast({
            text: t("function-soon"),
            type: "danger",
            position: "CENTER",
        });
    }

    const renderItem = ({
        item,
        drag,
        isActive,
    }: RenderItemParams<ItemChapter>) => {
        return (
            <ScaleDecorator>
                {selection && <Checkbox status="checked" />}
                <View
                    style={{
                        backgroundColor: isActive
                            ? "#ececec"
                            : theme.colors.primaryContrast,
                    }}
                >
                    <ItemCard
                        style={[styles.rowItem]}
                        onLongPress={drag}
                        disabled={isActive}
                        data={item}
                    />
                </View>
            </ScaleDecorator>
        );
    };

    return (
        <View style={[styles.container, themedStyles.container]}>
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
                            onPress: saveChanges,
                        },
                    ]}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    description: {
        fontSize: 14,
        fontWeight: "bold",
    },
    code: {
        fontSize: 13,
    },
});
