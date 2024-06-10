import {
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { DefaultTheme, useTheme } from "react-native-paper";
import CleanCard from "../../../../../../components/Card/Card";
import { formatPrices } from "../../../../../../utils/numbers";
import { UserContext } from "../../../../../../contexts/UserContext";
import { Chapter } from "../../../../../../api/budgets/Budgets";

interface ItemCard extends PressableProps {
    data: Chapter;
}

export default function ItemCard({
    data: { rank, description, totalCost, totalSale },
    disabled,
    onLongPress,
}: ItemCard) {
    const theme: DefaultTheme = useTheme();
    const { language } = useContext(UserContext);
    const [formattedTotalCost, setFormattedTotalCost] = useState<string>("");
    const [formattedTotalSale, setTotalSale] = useState<string>("");

    useEffect(() => {
        (() => {
            const formattedTotalCost = formatPrices({
                number: totalCost || 0,
                language,
            });
            const formattedTotalSale = formatPrices({
                number: totalSale || 0,
                language,
            });
            setFormattedTotalCost(formattedTotalCost);
            setTotalSale(formattedTotalSale);
        })();
    }, [totalCost, totalSale]);

    const stylesThemed = StyleSheet.create({
        text: {
            color: theme.colors.dark,
        },
        totalCost: {
            color: theme.colors.danger,
        },
        totalSale: {
            color: theme.colors.success,
        },
        rank: {
            backgroundColor: theme.colors.lightGrey,
            color: theme.colors.codeColor,
        },
    });
    return (
        <CleanCard>
            <Pressable onLongPress={onLongPress} disabled={disabled}>
                <CleanCard.Body style={{ paddingTop: 30 }}>
                    <Text style={[styles.rank, stylesThemed.rank]}>{rank}</Text>
                    <View style={[styles.container]}>
                        <View>
                            <Text
                                style={[stylesThemed.text, styles.description]}
                            >
                                {description}
                            </Text>
                        </View>
                    </View>
                </CleanCard.Body>
                <CleanCard.Footer>
                    <Text style={styles.number}>
                        <Text
                            style={[styles.totalCost, stylesThemed.totalCost]}
                        >
                            {formattedTotalCost}€
                        </Text>{" "}
                        -{" "}
                        <Text
                            style={[styles.totalSale, stylesThemed.totalSale]}
                        >
                            {formattedTotalSale}€
                        </Text>
                    </Text>
                </CleanCard.Footer>
            </Pressable>
        </CleanCard>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignContent: "space-between",
    },
    description: {
        fontSize: 14,
        fontWeight: "bold",
    },
    rank: {
        position: "absolute",
        padding: 5,
        paddingHorizontal: 10,
        left: 0,
        fontSize: 13,
        borderTopLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    number: {
        fontSize: 14,
        textAlign: "right",
    },
    totalCost: {
        fontWeight: "bold",
    },
    totalSale: {
        fontWeight: "bold",
    },
});
