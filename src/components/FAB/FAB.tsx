import * as React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import {
    FAB as FABRnp,
    IconButton,
    DefaultTheme,
    useTheme,
} from "react-native-paper";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import Text from "../Text/Text";

export interface actionsInterface {
    icon: IconSource;
    label: string;
    color?: string;
    onPress: () => void;
    backgroundColor?: string;
}

interface FABInterfaceBase {
    actions?: actionsInterface[];
    onOpen?: () => void;
    onClose?: () => void;
    primaryIcon?: IconSource;
    secondaryIcon?: IconSource;
}

interface FABInterfaceWithoutActions extends FABInterfaceBase {
    actions?: actionsInterface[];
    onOpen: () => void;
}

interface FABInterfaceWithActions extends FABInterfaceBase {
    actions: actionsInterface[];
    onOpen?: () => void;
}

type FABInterface = FABInterfaceWithoutActions | FABInterfaceWithActions;
const FAB = ({
    actions,
    onOpen,
    onClose,
    primaryIcon = "plus",
    secondaryIcon = "close",
}: FABInterface) => {
    const theme: DefaultTheme = useTheme();
    const [open, setOpen] = React.useState(false);
    const translation = useSharedValue(0);
    const opacity = useSharedValue(0);

    const openFunction = () => {
        onOpen && onOpen();
    };

    const closeFunction = () => {
        onClose && onClose();
    };

    const handlePress = () => {
        if (open) {
            closeFunction();
            translation.value = withTiming(0, { duration: 300 });
            opacity.value = withTiming(0, { duration: 300 });
        } else {
            !actions && openFunction();
            translation.value = withTiming(-100, { duration: 300 });
            opacity.value = withTiming(1, { duration: 300 });
        }
        setOpen(!open);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translation.value }],
            opacity: opacity.value,
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.actionsContainer, animatedStyle]}>
                {actions &&
                    actions.map((v, k) => (
                        <Pressable
                            key={k}
                            onPress={() => v.onPress()}
                            style={{
                                backgroundColor:
                                    v.backgroundColor || theme.colors.primary,
                                flexDirection: "row",
                                borderRadius: 100,
                                alignItems: "center",
                                paddingLeft: 15,
                                marginVertical: 3,
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        v.color || theme.colors.primaryContrast,
                                }}
                            >
                                {v.label}
                            </Text>
                            <IconButton
                                iconColor={theme.colors.primaryContrast}
                                icon={v.icon}
                                size={15}
                                style={{ margin: 0 }}
                            />
                        </Pressable>
                    ))}
            </Animated.View>
            <FABRnp
                style={[
                    styles.fab,
                    {
                        backgroundColor: actions
                            ? !open
                                ? theme.colors.primary
                                : theme.colors.primaryContrast
                            : theme.colors.primary,
                    },
                ]}
                icon={
                    actions ? (open ? secondaryIcon : primaryIcon) : primaryIcon
                }
                onPress={handlePress}
                color={
                    actions
                        ? !open
                            ? theme.colors.primaryContrast
                            : theme.colors.primary
                        : theme.colors.primaryContrast
                }
                rippleColor={
                    actions
                        ? !open
                            ? theme.colors.primaryContrast
                            : theme.colors.primary
                        : theme.colors.primaryContrast
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        right: 0,
        alignItems: "flex-end",
    },
    actionsContainer: {
        marginBottom: -20,
        right: 10,
        alignItems: "flex-end",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default FAB;
