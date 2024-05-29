import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
    DefaultTheme,
    FAB as FABButton,
    Portal,
    Provider,
    useTheme,
} from "react-native-paper";

interface FABInterface {
    actions?: any[];
    onOpen?: () => void;
    onClose?: () => void;
}

const FAB = ({ actions, onOpen, onClose }: FABInterface) => {
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
                    <FABButton.Group
                        open={open}
                        visible
                        color={theme.colors.primaryContrast}
                        icon={open ? "clipboard-check-outline" : "plus"}
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
