import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function AppHeader({
    title,
    actions,
}: {
    title: string;
    actions?: { icon: string; onPress?: () => void }[];
}) {
    const navigation: any = useNavigation();
    const styles = StyleSheet.create({
        container: { backgroundColor: "#FFF" },
        title: { color: "white", fontWeight: "bold" },
    });
    return (
        <Appbar.Header style={styles.container}>
            <Appbar.Action
                icon="menu"
                onPress={() => navigation.openDrawer()}
            />
            <Appbar.Content title={title} />
            {actions &&
                actions.map((v, k) => (
                    <Appbar.Action key={k} icon={v.icon} onPress={v.onPress} />
                ))}
        </Appbar.Header>
    );
}
