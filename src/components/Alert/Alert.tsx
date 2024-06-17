import { StyleSheet, View } from "react-native";
import React, { useCallback, useState } from "react";
import Button from "../Button/Button";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import Text from "../Text/Text";
import { DefaultTheme, Modal, Portal, useTheme } from "react-native-paper";
import { StyleProps } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { notificationToast } from "../../services/notifications/notifications";

export default function Alert({
    title,
    description,
    onCloseModal,
    showModal,
    onAccept,
    onCancel,
    titleStyle,
    acceptButtonText,
    cancelButtonText,
    type = "alert",
    showClose = true,
}: {
    title: string;
    description?: string;
    onCloseModal: () => void;
    showModal: boolean;
    onAccept?: () => Promise<void>;
    onCancel?: () => void;
    titleStyle?: StyleProps;
    acceptButtonText?: string;
    cancelButtonText?: string;
    type?: "alert" | "confirm";
    showClose?: boolean;
}) {
    const theme: DefaultTheme = useTheme();
    const { t } = useTranslation();
    const [disableActions, setDisableActions] = useState<boolean>(false);

    /**
     * The `handleAccept` function is a callback function defined using the `useCallback` hook in
     * React. It is responsible for handling the logic when the user accepts the alert or confirmation
     * dialog.
     */
    const handleAccept = useCallback(async () => {
        if (disableActions) return;

        if (onAccept) {
            setDisableActions(true);
            await onAccept().catch((e) => {
                notificationToast({
                    type: "danger",
                    text: t("fail-action"),
                });
                console.error(e);
                setDisableActions(false);
            });
            onCloseModal();
            setDisableActions(false);
        }
    }, [disableActions, onCloseModal, onAccept]);

    /**
     * The `handleClose` function defined using the `useCallback` hook in React is responsible for
     * handling the logic when the user closes the alert or confirmation dialog. Here's a breakdown of
     * what it does:
     */
    const handleClose = useCallback(() => {
        if (disableActions) return;
        onCloseModal();
        if (onCancel) {
            onCancel();
        }
    }, [disableActions, onCloseModal, onCancel]);

    return (
        <Portal>
            <Modal
                visible={showModal}
                onDismiss={onCloseModal}
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
                        <Text
                            style={[
                                styles.modalTitle,
                                { color: theme.colors.dark },
                                titleStyle,
                            ]}
                        >
                            {title}
                        </Text>
                        {showClose && (
                            <View>
                                <Button
                                    type="link"
                                    onPress={onCloseModal}
                                    icon={
                                        <Fontisto
                                            name="close"
                                            size={24}
                                            color={theme.colors.dark}
                                        />
                                    }
                                />
                            </View>
                        )}
                    </View>
                    <Text style={styles.description}>{description}</Text>
                    <View style={styles.buttons}>
                        {type === "confirm" && (
                            <View>
                                <Button
                                    text={cancelButtonText || t("cancel-label")}
                                    type="secondary"
                                    onPress={handleClose}
                                    disabled={disableActions}
                                    icon={
                                        <AntDesign
                                            name="close"
                                            size={20}
                                            color={
                                                disableActions
                                                    ? theme.colors.primaryLight
                                                    : theme.colors.primary
                                            }
                                        />
                                    }
                                />
                            </View>
                        )}
                        <View>
                            <Button
                                text={acceptButtonText || t("accept-label")}
                                onPress={handleAccept}
                                icon={
                                    <Entypo
                                        name="check"
                                        size={20}
                                        color={theme.colors.primaryContrast}
                                    />
                                }
                                disabled={disableActions}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    modalStyle: {
        backgroundColor: "white",
        justifyContent: "flex-start",
        padding: 20,
    },
    modalTitle: {
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
