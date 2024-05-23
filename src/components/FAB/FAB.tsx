import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { FAB as FABButton, Portal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const FAB = ({ actions }: { actions: any[] }) => {
    const [open, setOpen] = useState<boolean>(false);
    const navigation = useNavigation();

    const onStateChange = (open: boolean) => setOpen(open);

    useEffect(() => {
        return;
    }, [navigation]);

    const styles = StyleSheet.create({
        container: {
            position: "absolute",
            left: 16,
            bottom: 16,
        },
        fab: {
            backgroundColor: "#007AFF", // Color de fondo del FAB
        },
    });

    // Si el FAB no está abierto y no hay acciones disponibles, no renderizar el componente del FAB
    if (!open && (!actions || actions.length === 0)) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Portal>
                <FABButton.Group
                    open={open}
                    visible
                    icon={open ? "calendar-today" : "plus"}
                    actions={actions}
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
    );
};

export default FAB;
