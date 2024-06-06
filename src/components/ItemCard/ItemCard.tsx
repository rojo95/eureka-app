import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { DefaultTheme, useTheme } from "react-native-paper";
import CleanCard from "../CleanCard/CleanCard";
import { formatPrices } from "../../utils/numbers";

export default function ItemCard({
    code,
    description,
    cost,
    sale,
}: {
    code?: string;
    description: string;
    cost: number;
    sale: number;
}) {
    const theme: DefaultTheme = useTheme();
    const [totalCost, setTotalCost] = useState<string>("");
    const [totalSale, setTotalSale] = useState<string>("");

    useEffect(() => {
        const formatCostAndSale = async () => {
            const totalCost = await formatPrices({ number: cost });
            const totalSale = await formatPrices({ number: sale });
            setTotalCost(totalCost);
            setTotalSale(totalSale);
        };

        formatCostAndSale();

        return () => {};
    }, [cost, sale]);

    const stylesThemed = StyleSheet.create({
        text: {
            color: theme.colors.dark,
        },
        cost: {
            color: theme.colors.danger,
        },
        sale: {
            color: theme.colors.success,
        },
        code: {
            backgroundColor: theme.colors.lightGrey,
            color: theme.colors.codeColor,
        },
    });
    return (
        <CleanCard>
            <View
                style={[
                    styles.container,
                ]}
            >
                <Text
                    style={[
                        styles.text,
                        stylesThemed.text,
                        styles.code,
                        stylesThemed.code,
                    ]}
                >
                    {code}
                </Text>
                <View>
                    <Text
                        style={[
                            styles.text,
                            stylesThemed.text,
                            styles.description,
                        ]}
                    >
                        {description}
                    </Text>
                </View>
                <Text style={styles.number}>
                    <Text style={[styles.cost, stylesThemed.cost]}>
                        {totalCost}€
                    </Text>{" "}
                    -{" "}
                    <Text style={[styles.sale, stylesThemed.sale]}>
                        {totalSale}€
                    </Text>
                </Text>
            </View>
        </CleanCard>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignContent: "space-between",
        paddingHorizontal: 10,
        paddingTop: 30,
        paddingBottom: 10,
    },
    subtitleContainer: { paddingHorizontal: 24, paddingBottom: 10 },
    subtitle: {
        fontSize: 20,
    },
    rowItem: {
        flex: 1,
        height: 100,
        alignItems: "flex-start",
        justifyContent: "center",
        paddingHorizontal: 15,
        elevation: 10,
        margin: 10,
    },
    text: {},
    description: {
        fontSize: 14,
        fontWeight: "bold",
    },
    code: {
        position: "absolute",
        padding: 5,
        paddingHorizontal: 10,
        left: 0,
        fontSize: 13,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    number: {
        marginTop: 15,
        fontSize: 14,
        textAlign: "right",
    },
    cost: {
        fontWeight: "bold",
    },
    sale: {
        fontWeight: "bold",
    },
});
