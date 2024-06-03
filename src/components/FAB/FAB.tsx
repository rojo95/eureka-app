import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
    DefaultTheme,
    FAB as FABButton,
    Portal,
    Provider,
    useTheme,
} from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

interface FABInterface {
    actions?: any[];
    onOpen?: () => void;
    onClose?: () => void;
    inactiveIcon?: IconSource;
    activeIcon?: IconSource;
}

const FAB = ({
    actions,
    onOpen,
    onClose,
    inactiveIcon = "plus",
    activeIcon = "close",
}: FABInterface) => {
    const theme: DefaultTheme = useTheme();
    const [open, setOpen] = useState<boolean>(false);

    const onStateChange = (open: boolean) => setOpen(open);

    const openFunction = () => {
        onOpen && onOpen();
    };

    const closeFunction = () => {
        onClose && onClose();
    };

    const styles = StyleSheet.create({
        container: {
            position: "absolute",
            left: 16,
            bottom: 16,
        },
    });

    return (
        <Provider>
            <View style={styles.container}>
                <Portal>
                    <LinearGradient
                        colors={[
                            "transparent",
                            theme.colors.primaryContrast,
                            theme.colors.primaryContrast,
                        ]}
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: open ? "100%" : 0,
                        }}
                    />
                    <FABButton.Group
                        open={open}
                        visible
                        color={theme.colors.primaryContrast}
                        icon={open ? activeIcon : inactiveIcon}
                        actions={actions || []}
                        fabStyle={{ backgroundColor: theme.colors.primary }}
                        backdropColor={"transparent"}
                        onStateChange={() => {
                            actions && onStateChange(!open);
                        }}
                        onPress={() => {
                            if (open) {
                                closeFunction();
                            } else {
                                openFunction();
                            }
                        }}
                    />
                </Portal>
            </View>
        </Provider>
    );
};

export default FAB;
