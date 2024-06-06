import { ScrollView, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator, DefaultTheme, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";

import AppHeader from "../../../../components/AppHeader/AppHeader";
import { getBudget } from "../../../../services/budgets/Budgets";
import { ParamsContext } from "../../../../contexts/SharedParamsProvider";
import Text from "../../../../components/Text/Text";
import Button from "../../../../components/Button/Button";
import StateBadge from "../../../../components/StateBadge/StateBadge";
import {
    calculateKTotal,
    calculateMarginProfit,
    formatPrices,
    setDateFormat,
} from "../../../../utils/numbers";
import FAB from "../../../../components/FAB/FAB";
import Map from "../../../../components/Map/Map";
import { notificationToast } from "../../../../services/notifications/notifications";

export default function DetailsBudget() {
    const {
        contextParams: { itemId },
    } = useContext(ParamsContext)!;
    const { t } = useTranslation();
    const theme: DefaultTheme = useTheme();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalCost, setTotalCost] = useState<string>("");
    const [totalSale, setTotalSale] = useState<string>("");
    const [kTotal, setTotalKTotal] = useState<string>("");
    const [totalMarginProfit, setTotalMarginProfit] = useState<string>("");

    async function getDetails() {
        const info = await getBudget({ id: itemId });
        setData(info);
        setLoading(false);
    }

    /**
     * function to format the supplied costs and sales
     */
    useEffect(() => {
        const formatCostAndSale = async () => {
            const totalCost = await formatPrices({ number: data?.totalCost });
            const totalSale = await formatPrices({ number: data?.totalSale });
            const kTotal = await formatPrices({
                number: calculateKTotal({
                    totalCost: data.totalCost,
                    totalSale: data.totalSale,
                }),
            });
            const totalMarginProfit = await formatPrices({
                number: calculateMarginProfit({
                    totalCost: data.totalCost,
                    totalSale: data.totalSale,
                }),
            });
            setTotalCost(totalCost);
            setTotalSale(totalSale);
            setTotalKTotal(kTotal);
            setTotalMarginProfit(totalMarginProfit);
        };

        formatCostAndSale();

        return () => {};
    }, [data]);

    useEffect(() => {
        setLoading(true);
        getDetails();

        return () => {};
    }, [itemId]);

    const stylesThemed = StyleSheet.create({
        container: {
            backgroundColor: theme.colors.primaryContrast,
        },
        text: {
            color: theme.colors.dark,
        },
        cost: {
            color: theme.colors.danger,
        },
        sale: {
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
            {!data || loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <View>
                    <ScrollView style={[styles.content]}>
                        <View style={styles.containerCode}>
                            <Text>{data?.number}</Text>
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
                            {data.title}
                        </Text>
                        <StateBadge
                            id={data?.state?.id}
                            name={data?.state?.name}
                            customStyles={{
                                fontSize: 15,
                                paddingHorizontal: 10,
                            }}
                        />
                        <Text>{setDateFormat(data.createdAt)}</Text>
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
                                <Text>{data.totalHours}</Text>
                            </View>
                            <Image
                                source={
                                    data.client.profileImage ||
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
                                {data?.place ? (
                                    <View>
                                        <MaterialCommunityIcons
                                            name="map-marker-outline"
                                            size={24}
                                            color="black"
                                        />
                                        <Text>{data?.place?.name}</Text>
                                    </View>
                                ) : (
                                    <Text>{t("no-address-provided")}</Text>
                                )}
                            </View>

                            <Map
                                mapStyle={{ height: 200 }}
                                markerPreset={
                                    data?.place
                                        ? {
                                              latitude: data?.place?.lat,
                                              longitude: data?.place?.lng,
                                          }
                                        : null
                                }
                                address={
                                    data?.place
                                        ? {
                                              latitude: data?.place?.lat,
                                              latitudeDelta: 17.679489473469285,
                                              longitude: data?.place?.lng,
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
                                            stylesThemed.cost,
                                        ]}
                                    >
                                        {totalCost}€
                                    </Text>
                                    <Text
                                        style={[
                                            styles.price,
                                            stylesThemed.sale,
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
