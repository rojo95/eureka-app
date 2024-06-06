import * as React from "react";
import { View } from "react-native";
import { Modal as ModalRNP, Portal } from "react-native-paper";
import { StyleProps } from "react-native-reanimated";

interface ModalInterface {
    visible: boolean;
    children: React.ReactNode;
    onToggleShowModal: (value: boolean) => void;
    style: StyleProps;
}

const Modal = ({
    visible,
    children,
    onToggleShowModal,
    style,
}: ModalInterface) => {
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
};

const containerStyle = { backgroundColor: "white", padding: 20 };

export default Modal;
