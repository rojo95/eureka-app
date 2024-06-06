import { useState } from "react";
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
    backgroundColor?: string;
    icon: IconSource;
    label: string;
    color?: string;
    onPress: () => void;
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
    const [open, setOpen] = useState(false);
    const translations = actions?.reverse()?.map(() => useSharedValue(0)) || [];
    const opacities = actions?.map(() => useSharedValue(0)) || [];

    const openFunction = () => {
        onOpen && onOpen();
    };

    const closeFunction = () => {
        onClose && onClose();
    };

    const handlePress = () => {
        if (!actions) {
            openFunction();
        } else {
            if (open) {
                closeFunction();
                if (actions)
                    actions?.reverse()?.map((v, k) => {
                        translations[k].value = withTiming(0, {
                            duration: 300,
                        });
                        opacities[k].value = withTiming(0, { duration: 300 });
                    });
            } else {
                !actions && openFunction();
                if (actions)
                    actions?.reverse()?.map((v, k) => {
                        translations[k].value = withTiming(-(k + 1) * 75, {
                            duration: 300,
                        });
                        opacities[k].value = withTiming(1, { duration: 300 });
                    });
            }
            setOpen(!open);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.actionsContainer]}>
                {actions &&
                    actions.map((v, k) => {
                        const animatedStyle = useAnimatedStyle(() => {
                            return {
                                transform: [
                                    { translateY: translations[k].value },
                                ],
                                opacity: opacities[k].value,
                            };
                        });
                        return (
                            <Animated.View style={[animatedStyle]} key={k}>
                                <Pressable
                                    onPress={() => {
                                        handlePress();
                                        v.onPress();
                                    }}
                                    style={[
                                        styles.actions,
                                        {
                                            backgroundColor:
                                                v.backgroundColor ||
                                                theme.colors.primary,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={{
                                            color:
                                                v.color ||
                                                theme.colors.primaryContrast,
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
                            </Animated.View>
                        );
                    })}
            </View>
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
        position: "absolute",
        top: -40,
        right: 10,
        alignItems: "flex-end",
        justifyContent: "flex-end",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    },
    actions: {
        flexDirection: "row",
        borderRadius: 100,
        alignItems: "center",
        paddingLeft: 15,
        marginVertical: 3,
    },
});

export default FAB;
