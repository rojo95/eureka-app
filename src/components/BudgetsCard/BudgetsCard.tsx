import {
    Image,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    View,
} from "react-native";
import Text from "../Text/Text";
import { Badge, DefaultTheme, useTheme } from "react-native-paper";

interface BudgetsCardInterface extends TouchableOpacityProps {
    index?: any;
    description: any;
    status: { id: number; name: string };
    costo: any;
    venta: any;
    onPress?: () => void;
}

const BudgetsCard = ({
    index,
    description,
    status,
    costo,
    venta,
    onPress,
}: BudgetsCardInterface) => {
    const theme: DefaultTheme = useTheme();
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
        badgeContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
        },
        badge: {
            marginRight: 8,
            color: theme.colors.dark,
        },
        costo: {
            color: theme.colors.danger,
            fontWeight: "bold",
        },
        venta: {
            color: theme.colors.success,
            fontWeight: "bold",
        },
    });

    const CustomBadge: React.FC<{ id: number; name: string }> = ({
        id,
        name,
    }) => {
        const info = {
            ...(id === 1
                ? { color: theme.colors.primaryLight }
                : id === 2
                ? { color: theme.colors.deepBlueLight }
                : id === 4
                ? { color: theme.colors.dangerLight }
                : { color: theme.colors.successLight }),
        };
        return (
            <View style={styles.badgeContainer}>
                <Badge style={[styles.badge, { backgroundColor: info.color }]}>
                    {name}
                </Badge>
            </View>
        );
    };

    return (
        <TouchableOpacity
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            onPress={onPress}
        >
            <View>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View>
                            <Text style={styles.code}>{index}</Text>
                        </View>
                        <Text style={styles.description}>{description}</Text>
                        <CustomBadge id={status?.id} name={status?.name} />
                        <Text style={styles.number}>
                            <Text style={styles.costo}>{costo}€</Text> -{" "}
                            <Text style={styles.venta}>{venta}€</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default BudgetsCard;
