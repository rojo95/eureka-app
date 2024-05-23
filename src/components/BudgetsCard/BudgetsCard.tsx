import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "../Text/Text";
import { Badge } from "react-native-paper";

const BudgetsCard = ({
    imageUrl,
    index,
    description,
    status,
    costo,
    venta,
}: {
    imageUrl?: any;
    index?: any;
    description?: any;
    status?: any;
    costo?: any;
    venta?: any;
}) => {
    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            borderTopLeftRadius: 0,
            borderBottomStartRadius: 0,
            borderRadius: 10,
            overflow: "hidden",
            backgroundColor: "#f0f2f5",
            shadowColor: "#000",
            elevation: 5,
            marginVertical: 10,
            marginEnd: 10,
            alignSelf: "center",
        },
        imageContainer: {
            width: "40%",
            overflow: "hidden",
        },
        image: {
            flex: 1,
            aspectRatio: 4 / 3,
        },
        content: {
            flex: 1,
            padding: 16,
        },
        description: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 8,
        },
        number: {
            fontSize: 14,
            textAlign: "right",
            color: "#666",
        },
        code: {
            fontSize: 14,
        },
        badgeContainer: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
        },
        badge: {
            marginRight: 8,
        },
        button: {
            backgroundColor: "#F39200",
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 15,
            alignSelf: "flex-start",
        },
        buttonText: {
            color: "#fff",
        },
    });

    return (
        <TouchableOpacity
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
            <View>
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View>
                            <Text style={styles.code}>{index}</Text>
                        </View>
                        <Text style={styles.description}>{description}</Text>
                        <View style={styles.badgeContainer}>
                            <Badge style={styles.badge}>{status}</Badge>
                        </View>
                        <Text style={styles.number}>
                            {costo}€ - {venta}€
                        </Text>
                    </View>
                    {imageUrl && (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.image}
                            />
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default BudgetsCard;
