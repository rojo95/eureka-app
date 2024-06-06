import {
    StyleSheet,
    TouchableOpacityProps,
    View,
    TouchableOpacity,
} from "react-native";
import Text from "../Text/Text";
import { ActivityIndicator, DefaultTheme, useTheme } from "react-native-paper";
import StateBadge from "../StateBadge/StateBadge";
import { formatPrices } from "../../utils/numbers";
import { useEffect, useState } from "react";

interface BudgetsCardInterface extends TouchableOpacityProps {
    index?: any;
    description: any;
    status: { id: number; name: string };
    cost: any;
    sale: any;
    onPress?: () => void;
}

const BudgetsCard = ({
    index,
    description,
    status,
    cost,
    sale,
    onPress,
}: BudgetsCardInterface) => {
    const theme: DefaultTheme = useTheme();
    const [formattedCost, setFormattedCost] = useState<string>("");
    const [formattedSale, setFormattedSale] = useState<string>("");

    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            borderTopLeftRadius: 0,
            borderBottomStartRadius: 0,
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: theme.colors.primaryContrast,
            shadowColor: "#000",
            elevation: 5,
            marginVertical: 10,
            marginEnd: 10,
            alignSelf: "center",
        },
        content: {
            flex: 1,
            padding: 16,
        },
        description: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
            color: theme.colors.dark,
        },
        number: {
            fontSize: 14,
            textAlign: "right",
        },
        code: {
            fontSize: 14,
            color: theme.colors.codeColor,
        },
        cost: {
            color: theme.colors.danger,
            fontWeight: "bold",
        },
        sale: {
            color: theme.colors.success,
            fontWeight: "bold",
        },
    });

    useEffect(() => {
        const formatCostAndSale = async () => {
            const formattedCost = await formatPrices({ number: cost });
            const formattedSale = await formatPrices({ number: sale });
            setFormattedCost(formattedCost);
            setFormattedSale(formattedSale);
        };

        formatCostAndSale();
    }, [cost, sale]);

    return (
        <TouchableOpacity
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            onPress={onPress}
        >
            <View style={styles.container}>
                <View style={styles.content}>
                    <View>
                        <Text style={styles.code}>{index}</Text>
                    </View>
                    <Text style={styles.description}>{description}</Text>
                    <StateBadge id={status?.id} name={status?.name} />
                    <Text style={styles.number}>
                        {formattedCost === "" ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <Text>
                                <Text style={styles.cost}>
                                    {formattedCost}€
                                </Text>{" "}
                                -{" "}
                                <Text style={styles.sale}>
                                    {formattedSale}€
                                </Text>
                            </Text>
                        )}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default BudgetsCard;
