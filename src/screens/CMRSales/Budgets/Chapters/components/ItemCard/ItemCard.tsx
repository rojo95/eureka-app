import {
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
    View,
} from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { DefaultTheme, useTheme } from "react-native-paper";
import Card from "../../../../../../components/Card/Card";
import { formatPrices } from "../../../../../../utils/numbers";
import { UserContext } from "../../../../../../contexts/UserContext";
import { Chapter } from "../../../../../../api/budgets/budgets";

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

    const formattedTotalCost = useMemo(() => {
        return formatPrices({ number: totalCost || 0, language });
    }, [totalCost, language]);

    const formattedTotalSale = useMemo(() => {
        return formatPrices({ number: totalSale || 0, language });
    }, [totalSale, language]);

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
        <Card>
            <Pressable onLongPress={onLongPress} disabled={disabled}>
                <Card.Body style={styles.cardBody}>
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
                </Card.Body>
                <Card.Footer>
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
                </Card.Footer>
            </Pressable>
        </Card>
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
    cardBody: {
        paddingTop: 30,
    },
});
