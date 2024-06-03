import { FlatList, ListRenderItem, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, DefaultTheme, useTheme } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import AppHeader from "../../../../components/AppHeader/AppHeader";
import { ParamsContext } from "../../../../contexts/SharedParamsProvider";
import { trackingBudget } from "../../../../services/budgets/Budgets";
import FAB from "../../../../components/FAB/FAB";
import CleanCard from "../../../../components/CleanCard/CleanCard";
import Button from "../../../../components/Button/Button";
import Text from "../../../../components/Text/Text";
import { setDateFormat } from "../../../../utils/numbers";

export default function Tracking() {
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
     * function to get the tracking
     */
    async function getTracking() {
        const info = await trackingBudget({ id: itemId });
        setData(info);
        setLoading(false);
        console.log("tracking: ", info);
    }

    /**
     * apply when the itemId change
     */
    useEffect(() => {
        setLoading(true);
        getTracking();
        return () => {};
    }, [itemId]);

    /**
     * content to render the information
     * @param param0
     * @returns
     */
    const renderItem: ListRenderItem<any> = ({ item }) => (
        <CleanCard>
            <View
                style={{
                    flex: 1,
                    width: "100%",
                    alignContent: "space-between",
                    padding: 30,
                    backgroundColor: "white",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor:
                                item.type === 1
                                    ? "#44cf73"
                                    : item.type === 2
                                    ? theme.colors.primary
                                    : item.type === 3
                                    ? "#42cfc3"
                                    : item.type === 4
                                    ? "#ee5a3f"
                                    : "#798deb",
                            width: 35,
                            height: 35,
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 5,
                        }}
                    >
                        {item.type === 1 ? (
                            <FontAwesome5
                                name="clipboard-list"
                                size={24}
                                color="white"
                            />
                        ) : item.type === 2 ? (
                            <Ionicons name="mail" size={24} color="white" />
                        ) : item.type === 3 ? (
                            <FontAwesome5
                                name="phone-alt"
                                size={24}
                                color="white"
                            />
                        ) : item.type === 4 ? (
                            <MaterialCommunityIcons
                                name="calendar-clock"
                                size={24}
                                color="white"
                            />
                        ) : (
                            <FontAwesome
                                name="trophy"
                                size={24}
                                color="white"
                            />
                        )}
                    </View>
                    <Text>{setDateFormat(item.date)}</Text>
                </View>
                <Text numberOfLines={3} ellipsizeMode="tail">
                    {item.notes}
                </Text>
            </View>
        </CleanCard>
    );

    return (
        <View style={[themedStyles.container, styles.container]}>
            <AppHeader
                title={t("budget-details-title")}
                actions={[{ icon: "dots-vertical" }]}
                subtitle={t("tracking-label")}
            />
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                }}
            >
                {loading ? (
                    <ActivityIndicator size="large" />
                ) : data.length > 0 ? (
                    <FlatList
                        style={{
                            width: "100%",
                        }}
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                ) : (
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <View>
                            <Button text={t("create-new-tracking-note")} />
                        </View>
                    </View>
                )}

                <FAB
                    actions={[
                        {
                            icon: "plus",
                            label: t("new-note"),
                            onPress: () => {
                                console.log("create new");
                            },
                            color: theme.colors.primary,
                            style: {
                                backgroundColor: theme.colors.primaryContrast,
                                borderRadius: 20,
                            },
                        },
                        {
                            icon: "check",
                            label: t("select-label"),
                            onPress: () => {
                                console.log("select");
                            },
                            color: theme.colors.primary,
                            style: {
                                backgroundColor: theme.colors.primaryContrast,
                                borderRadius: 20,
                            },
                        },
                        {
                            icon: "content-save",
                            label: t("save-label"),
                            onPress: () => {
                                console.log("content-save");
                            },
                            color: theme.colors.primary,
                            style: {
                                backgroundColor: theme.colors.primaryContrast,
                                borderRadius: 20,
                            },
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
});