import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
    DefaultTheme,
    FAB as FABButton,
    Portal,
    Provider,
    useTheme,
} from "react-native-paper";

interface ActionsInterface {}
const FAB = ({ actions }: { actions: any[] }) => {
    const theme: DefaultTheme = useTheme();
    const [open, setOpen] = useState<boolean>(false);

    const onStateChange = (open: boolean) => setOpen(open);

    const styles = StyleSheet.create({
        container: {
            position: "absolute",
            left: 16,
            bottom: 16,
        },
        fab: {
            color: "#fff", // Color de fondo del FAB
        },
    });

    // Si el FAB no está abierto y no hay acciones disponibles, no renderizar el componente del FAB
    if (!open && (!actions || actions.length === 0)) {
        return null;
    }

    return (
        <Provider>
            <View style={styles.container}>
                <Portal>
                    <FABButton.Group
                        open={open}
                        visible
                        color={theme.colors.primaryContrast}
                        icon={open ? "clipboard-check-outline" : "plus"}
                        actions={actions}
                        fabStyle={{ backgroundColor: theme.colors.primary }}
                        backdropColor={"transparent"}
                        onStateChange={() => {
                            onStateChange(!open);
                        }}
                        onPress={() => {
                            if (open) {
                                // hacer algo si el grupo está abierto
                            }
                        }}
                    />
                </Portal>
            </View>
        </Provider>
    );
};

export default FAB;
