import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import ChangeLanguageModal from "../ChangeLanguageModal/ChangeLanguageModal";

export default function AppHeader({
    title,
    actions,
}: {
    title: string;
    actions?: { icon: string; onPress?: () => void }[];
}) {
    const navigation: any = useNavigation();
    const [showModal, setShowModal] = useState<boolean>(false);

    const styles = StyleSheet.create({
        container: { backgroundColor: "#FFF" },
        title: { color: "white", fontWeight: "bold" },
    });

    return (
        <View>
            <ChangeLanguageModal
                showModal={showModal}
                toggleModal={() => setShowModal(!showModal)}
            />
            <Appbar.Header style={styles.container}>
                <Appbar.Action
                    icon="menu"
                    onPress={() => navigation.openDrawer()}
                />
                <Appbar.Content title={title} />
                <Appbar.Action
                    icon="earth"
                    onPress={() => setShowModal(!showModal)}
                />
                {actions &&
                    actions.map((v, k) => (
                        <Appbar.Action
                            key={k}
                            icon={v.icon}
                            onPress={v.onPress}
                        />
                    ))}
            </Appbar.Header>
        </View>
    );
}
