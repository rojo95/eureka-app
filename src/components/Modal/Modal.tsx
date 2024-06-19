import * as React from "react";
import { View } from "react-native";
import { Modal as ModalRNP, Portal } from "react-native-paper";
import { StyleProps } from "react-native-reanimated";

type Modal = {
    visible: boolean;
    children: React.ReactNode;
    onToggleShowModal: (value: boolean) => void;
    style: StyleProps;
};

export default function Modal({
    visible,
    children,
    onToggleShowModal,
    style,
}: Modal) {
    const hideModal = () => onToggleShowModal(false);

    return (
        <View>
            <Portal>
                <ModalRNP
                    style={style}
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={containerStyle}
                >
                    {children}
                </ModalRNP>
            </Portal>
        </View>
    );
}

const containerStyle = { backgroundColor: "white", padding: 20 };
