import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import AppHeader from "../../../../components/AppHeader/AppHeader";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import FAB from "../../../../components/FAB/FAB";
import { Checkbox, DefaultTheme, useTheme } from "react-native-paper";
import { Chapter } from "../../../../api/budgets/budgets";
import ItemCard from "./components/ItemCard/ItemCard";
import { ParamsContext } from "../../../../contexts/SharedParamsProvider";
import { notificationToast } from "../../../../services/notifications/notifications";

export default function Chapters() {
    const theme: DefaultTheme = useTheme();
    const { t } = useTranslation();

    const {
        contextParams: { budgetId, chapters: baseChapters },
    } = useContext(ParamsContext)!;
    const [loading, setLoading] = useState<boolean>(true);
    const [selection, setSelection] = useState<boolean>(false);
    const [chapters, setChapter] = useState<Chapter[]>(baseChapters);

    /**
     * function to establish the chapters that were consulted the budget details
     */
    async function getChapters() {
        setChapter(baseChapters);
    }

    /**
     * Fetches chapters data when the component mounts or when the budget ID or base chapters change.
     */
    useEffect(() => {
        setLoading(true);
        (async () => {
            await getChapters();
            setLoading(false);
        })();
    }, [budgetId, baseChapters]);

    const themedStyles = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primaryContrast,
        },
    });

    function handleListUpdate(Chapters: Chapter[]) {
        const settedList: Chapter[] = Chapters?.map((v, k) => {
            return { ...v, rank: `${k + 1}` };
        });
        setChapter(settedList);
    }

    async function saveChanges() {
        notificationToast({
            text: t("function-soon"),
            type: "danger",
            position: "CENTER",
        });
    }

    /**
     * function rendered into the flat list
     */
    const renderItem = ({
        item,
        drag,
        isActive,
    }: RenderItemParams<Chapter>) => {
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
            ) : chapters?.length > 0 ? (
                <View style={{ marginBottom: 150 }}>
                    <DraggableFlatList
                        data={chapters}
                        onDragEnd={({ data }) => {
                            handleListUpdate(data);
                        }}
                        keyExtractor={(item, k) => k.toString()}
                        renderItem={renderItem}
                    />
                </View>
            ) : (
                <></>
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
