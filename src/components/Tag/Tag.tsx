import { StyleSheet, Text, TouchableHighlight } from "react-native";
import React, { ReactNode } from "react";
import { DefaultTheme, useTheme } from "react-native-paper";

interface TagInterface {
    text: string;
    icon?: ReactNode;
    onPress?: () => void;
}

/**
 * Component to render tags
 * @param {TagInterface} param
 * @param {string} param.text
 * @param {ReactNode} param.icon
 * @returns
 */
export default function Tag({ text, icon, onPress }: TagInterface) {
    const theme: DefaultTheme = useTheme();

    return (
        <TouchableHighlight
            style={[
                styles.filterBadge,
                { backgroundColor: theme.colors.primary },
            ]}
            onPress={onPress}
        >
            <Text
                style={[
                    styles.filterBadgeText,
                    { color: theme.colors.primaryContrast },
                ]}
            >
                <Text>{text}</Text>
                {icon && <Text> {icon}</Text>}
            </Text>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    filterBadge: {
        margin: 3,
        paddingHorizontal: 7,
        paddingVertical: 5,
        borderRadius: 100,
    },
    filterBadgeText: {
        fontSize: 13,
    },
});
