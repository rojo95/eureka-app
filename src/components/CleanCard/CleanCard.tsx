import { StyleSheet, View } from "react-native";
import React, { ReactNode } from "react";

export default function CleanCard({ children }: { children: ReactNode }) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: "100%",
    },
    content: {
        margin: 2,
        borderRadius: 5,
        overflow: "hidden",
        elevation: 6,
        shadowColor: "#000",
        backgroundColor: "white",
    },
});
