import { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
    BadgeProps,
    Badge as BadgeRNP,
    DefaultTheme,
    useTheme,
} from "react-native-paper";
import { StyleProps } from "react-native-reanimated";
import Text from "../Text/Text";

interface BadgeBase extends BadgeProps {
    customStyles?: StyleProps;
    icon?: ReactNode;
    colorStyle?: StyleProps;
}

interface BadgeWithIcon extends BadgeBase {
    icon?: never;
    colorStyle?: never;
}

interface BadgeWithoutIcon extends BadgeBase {
    icon: ReactNode;
    colorStyle?: StyleProps;
}

type Badge = BadgeWithIcon | BadgeWithoutIcon;

const CustomBadge: React.FC<Badge> = ({
    children,
    customStyles,
    onPress,
    icon,
    colorStyle,
}) => {
    const theme: DefaultTheme = useTheme();
    return (
        <View style={styles.badgeContainer}>
            {icon ? (
                <Pressable
                    onPress={onPress}
                    style={[
                        {
                            backgroundColor: theme.colors.primary,
                            flexDirection: "row",
                            alignItems: "center",
                        },
                        styles.badge,
                        customStyles,
                    ]}
                >
                    <Text style={colorStyle}>{children}</Text>
                    {icon}
                </Pressable>
            ) : (
                <BadgeRNP
                    style={[
                        styles.badge,
                        { backgroundColor: theme.colors.primary },
                        customStyles,
                    ]}
                    onPress={onPress}
                >
                    {children}
                </BadgeRNP>
            )}
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

export default CustomBadge;
