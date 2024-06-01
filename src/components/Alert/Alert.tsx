import { StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Button from "../Button/Button";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import Text from "../Text/Text";
import { DefaultTheme, Modal, Portal, useTheme } from "react-native-paper";
import { StyleProps } from "react-native-reanimated";

export default function Alert({
    title,
    description,
    closeModal,
    showModal,
    accept,
    cancel,
    modalTytle,
}: {
    title: string;
    description?: string;
    closeModal: () => void;
    showModal: boolean;
    accept?: () => void;
    cancel?: () => void;
    modalTytle?: StyleProps;
}) {
    const theme: DefaultTheme = useTheme();
    const [disableActions, setDisableActions] = useState<boolean>(false);

    const handleAccept = useCallback(() => {
        if (disableActions) return;
        setDisableActions(true);

        closeModal();
        if (accept) {
            accept();
        }

        setTimeout(() => {
            setDisableActions(false);
        }, 3000);
    }, [disableActions, closeModal, accept]);

    const handleClose = useCallback(() => {
        if (disableActions) return;
        setDisableActions(true);

        closeModal();
        if (cancel) {
            cancel();
        }
    }, [disableActions, closeModal, cancel]);

    const styles = StyleSheet.create({
        modalStyle: {
            backgroundColor: "white",
            justifyContent: "flex-start",
            padding: 20,
        },
        modalTytle: {
            color: theme.colors.dark,
            fontWeight: "bold",
            alignItems: "center",
        },
        buttons: {
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-around",
            marginVertical: 5,
        },
        description: {
            marginVertical: 10,
        },
    });

    return (
        <Portal>
            <Modal
                visible={showModal}
                onDismiss={closeModal}
                contentContainerStyle={styles.modalStyle}
            >
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginVertical: 5,
                        }}
                    >
                        <Text style={[styles.modalTytle, modalTytle]}>
                            {title}
                        </Text>
                        <View>
                            <Button
                                type="link"
                                onPress={closeModal}
                                icon={
                                    <Fontisto
                                        name="close"
                                        size={24}
                                        color={theme.colors.dark}
                                    />
                                }
                            />
                        </View>
                    </View>
                    <Text style={styles.description}>{description}</Text>
                    <View style={styles.buttons}>
                        <View>
                            <Button
                                text="Cancelar"
                                type="secondary"
                                onPress={handleClose}
                                icon={
                                    <AntDesign
                                        name="close"
                                        size={20}
                                        color={theme.colors.primary}
                                    />
                                }
                            />
                        </View>
                        <View>
                            <Button
                                text="Exportar"
                                onPress={handleAccept}
                                icon={
                                    <Entypo
                                        name="check"
                                        size={20}
                                        color={theme.colors.primaryContrast}
                                    />
                                }
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}
