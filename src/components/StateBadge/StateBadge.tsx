import { StyleSheet, View } from "react-native";
import { Badge, DefaultTheme, useTheme } from "react-native-paper";
import { StyleProps } from "react-native-reanimated";

interface StateBadgeInterface {
    id: number;
    name: string;
    customStyles?: StyleProps;
}

const StateBadge: React.FC<StateBadgeInterface> = ({
    id,
    name,
    customStyles,
}) => {
    const theme: DefaultTheme = useTheme();
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
            <Badge
                style={[
                    styles.badge,
                    { backgroundColor: info.color, color: theme.colors.dark },
                    customStyles,
                ]}
            >
                {name}
            </Badge>
        </View>
    );
};

const styles = StyleSheet.create({
    badgeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    badge: {
        marginRight: 8,
    },
});

export default StateBadge;
