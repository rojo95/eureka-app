import React, { useContext, useEffect, useState } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import AppHeader from "../../../../components/AppHeader/AppHeader";
import { useTranslation } from "react-i18next";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import FAB, { actionsInterface } from "../../../../components/FAB/FAB";
import { Checkbox, DefaultTheme, useTheme } from "react-native-paper";
import { getBudget } from "../../../../services/budgets/Budgets";
import ItemCard from "../../../../components/ItemCard/ItemCard";
import { ParamsContext } from "../../../../contexts/SharedParamsProvider";

type Item = {
    key: string;
    id: number;
    rank: string;
    description: string;
    totalCost: number;
    totalSale: number;
};

export default function Chapters() {
    const {
        contextParams: { itemId },
    } = useContext(ParamsContext)!;
    const navigation: any = useNavigation();
    const [loading, setLoading] = useState<boolean>(true);
    const [selection, setSelection] = useState<boolean>(false);

    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();

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
            padding: 15,
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
        console.log("update list at api");
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

    const FABActions = [
        {
            icon: "download",
            label: t("export-chapter-s"),
            onPress: () => {
                console.log("download");
            },
        },
        {
            icon: "upload",
            label: t("import-chapter-s"),
            onPress: () => {
                console.log("upload");
            },
        },
        {
            icon: "content-save",
            label: t("save-label"),
            onPress: () => {
                console.log("save");
            },
        },
    ];

    return (
        <View style={styles.container}>
            <AppHeader
                title={t("budget-details-title")}
                actions={[{ icon: "dots-vertical" }]}
                subtitle={t("chapters-label")}
                subtitleAction={[
                    {
                        text: !selection ? t("edit-list") : t("cancel-label"),
                        action: () => setSelection(!selection),
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
                    actions={
                        selection
                            ? [
                                  ...FABActions,
                                  {
                                      icon: "trash-can",
                                      label: t("delete-chapter-label"),
                                      onPress: () => {
                                          setSelection(false);
                                          console.log("delete");
                                      },
                                      backgroundColor:
                                          theme.colors.dangerIntense,
                                  },
                              ]
                            : FABActions
                    }
                ></FAB>
            </View>
        </View>
    );
}
