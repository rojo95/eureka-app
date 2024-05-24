import * as React from "react";
import { View } from "react-native";
import { Modal as ModalRNP, Portal, PaperProvider } from "react-native-paper";
import { StyleProps } from "react-native-reanimated";

interface ModalInterface {
    visible: boolean;
    children: React.ReactNode;
    setShowModal: any;
    style: StyleProps;
}

const Modal = ({ visible, children, setShowModal, style }: ModalInterface) => {
    const hideModal = () => setShowModal(false);
    const containerStyle = { backgroundColor: "white", padding: 20 };

    return (
        <View>
            {/* <PaperProvider> */}
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
            {/* </PaperProvider> */}
        </View>
    );
};

export default Modal;
