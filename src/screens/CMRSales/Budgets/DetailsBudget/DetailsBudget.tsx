import { ScrollView, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, DefaultTheme, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";

import AppHeader from "../../../../components/AppHeader/AppHeader";
import { Budget, getBudget } from "../../../../api/budgets/budgets";
import { ParamsContext } from "../../../../contexts/SharedParamsProvider";
import Text from "../../../../components/Text/Text";
import Button from "../../../../components/Button/Button";
import { formatPrices, setDateFormat } from "../../../../utils/numbers";
import FAB from "../../../../components/FAB/FAB";
import Map from "../../../../components/Map/Map";
import { notificationToast } from "../../../../services/notifications/notifications";
import CustomBadge from "../../../../components/CustomBadge/CustomBadge";
import {
    calculateKTotal,
    calculateMarginProfit,
    getColorState,
} from "../utils/utils";
import { UserContext } from "../../../../contexts/UserContext";

export default function DetailsBudget() {
    const {
        contextParams: { budgetId },
        setContextParams,
    } = useContext(ParamsContext)!;
    const { language } = useContext(UserContext);
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();

    const [budgetDetails, setBudgetDetails] = useState<Budget | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    async function getDetails() {
        const info = await getBudget({ budgetId });
        setContextParams((prev: any) => ({
            ...prev,
            chapters: info?.chapters,
        }));
        setBudgetDetails(info);
    }

    /**
     * functions to format the supplied costs and sales
     */
    const { totalCost, totalSale, kTotal, totalMarginProfit } = useMemo(() => {
        const totalCost = formatPrices({
            number: budgetDetails?.totalCost || 0,
            language,
        });

        const totalSale = formatPrices({
            number: budgetDetails?.totalSale || 0,
            language,
        });

        const kTotal = formatPrices({
            number:
                calculateKTotal({
                    totalCost: budgetDetails?.totalCost!,
                    totalSale: budgetDetails?.totalSale!,
                }) || 0,
            language,
        });
        const totalMarginProfit = formatPrices({
            number:
                calculateMarginProfit({
                    totalCost: budgetDetails?.totalCost!,
                    totalSale: budgetDetails?.totalSale!,
                }) || 0,
            language,
        });
        return { totalCost, totalSale, kTotal, totalMarginProfit };
    }, [budgetDetails, language]);

    useEffect(() => {
        setLoading(true);
        (async () => {
            await getDetails();
            setLoading(false);
        })();
    }, [budgetId]);

    const stylesThemed = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primaryContrast,
        },
        text: {
            color: theme.colors.dark,
        },
        totalCost: {
            color: theme.colors.danger,
        },
        totalSale: {
            color: theme.colors.success,
        },
    });

    return (
        <View style={[styles.container, stylesThemed.container]}>
            <AppHeader
                title={t("budget-details-title")}
                actions={[{ icon: "dots-vertical" }]}
                subtitle={t("information-label")}
            />
            {!budgetDetails || loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <View>
                    <ScrollView style={[styles.content]}>
                        <View style={styles.containerCode}>
                            <Text>{budgetDetails?.number}</Text>
                            <View>
                                <Button
                                    type="link"
                                    buttonStyle={{
                                        backgroundColor: theme.colors.primary,
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                    }}
                                    icon={
                                        <MaterialCommunityIcons
                                            name="pencil"
                                            size={24}
                                            color="white"
                                        />
                                    }
                                />
                            </View>
                        </View>
                        <Text style={[styles.title, stylesThemed.text]}>
                            {budgetDetails.title}
                        </Text>
                        <CustomBadge
                            customStyles={{
                                fontSize: 15,
                                paddingHorizontal: 10,
                                color: theme.colors.dark,
                                backgroundColor: getColorState({
                                    statusId: budgetDetails.state.id,
                                    theme,
                                }),
                            }}
                        >
                            {budgetDetails?.state?.name}
                        </CustomBadge>
                        <Text>
                            {setDateFormat({
                                date: new Date(budgetDetails.createdAt),
                                language,
                            })}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                            }}
                        >
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons
                                    name="clock-time-four-outline"
                                    size={50}
                                    color="black"
                                />
                                <Text>{budgetDetails.totalHours}</Text>
                            </View>
                            <Image
                                source={
                                    budgetDetails.client.profileImage ||
                                    require("../../../../../assets/avatar-pending.jpg")
                                }
                                style={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: 100,
                                }}
                            />
                            <View style={styles.iconContainer}>
                                <Feather
                                    name="pie-chart"
                                    size={50}
                                    color="black"
                                />
                                {kTotal !== "" && (
                                    <View>
                                        <Text>
                                            K=
                                            {kTotal}
                                        </Text>
                                        <Text>{totalMarginProfit}%</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={styles.mapContainer}>
                            <View style={styles.mapAddress}>
                                {budgetDetails?.place ? (
                                    <View>
                                        <MaterialCommunityIcons
                                            name="map-marker-outline"
                                            size={24}
                                            color="black"
                                        />
                                        <Text>
                                            {budgetDetails?.place?.name}
                                        </Text>
                                    </View>
                                ) : (
                                    <Text>{t("no-address-provided")}</Text>
                                )}
                            </View>

                            <Map
                                mapStyle={{ height: 200 }}
                                markerPreset={
                                    budgetDetails?.place
                                        ? {
                                              latitude:
                                                  budgetDetails?.place?.lat,
                                              longitude:
                                                  budgetDetails?.place?.lng,
                                          }
                                        : null
                                }
                                address={
                                    budgetDetails?.place
                                        ? {
                                              latitude:
                                                  budgetDetails?.place?.lat,
                                              latitudeDelta: 17.679489473469285,
                                              longitude:
                                                  budgetDetails?.place?.lng,
                                              longitudeDelta: 12.98109669238329,
                                          }
                                        : null
                                }
                                readOnly={true}
                            />
                        </View>
                        <View
                            style={{
                                alignItems: "flex-end",
                                marginTop: 20,
                            }}
                        >
                            {totalCost === "" ? (
                                <ActivityIndicator size={"small"} />
                            ) : (
                                <View>
                                    <Text
                                        style={[
                                            styles.price,
                                            stylesThemed.totalCost,
                                        ]}
                                    >
                                        {totalCost}€
                                    </Text>
                                    <Text
                                        style={[
                                            styles.price,
                                            stylesThemed.totalSale,
                                        ]}
                                    >
                                        {totalSale}€
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            )}
            <FAB
                primaryIcon="content-save"
                onOpen={() =>
                    notificationToast({
                        text: t("function-soon"),
                        type: "danger",
                        position: "CENTER",
                    })
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerCode: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    content: {
        paddingHorizontal: 25,
        marginBottom: -100,
    },
    title: {
        marginVertical: 5,
        fontSize: 20,
        fontWeight: "bold",
    },
    code: {
        fontSize: 13,
    },
    iconContainer: {
        alignItems: "center",
    },
    mapContainer: {},
    mapAddress: {
        marginVertical: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    price: {
        fontWeight: "bold",
    },
});
