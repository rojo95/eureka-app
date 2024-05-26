import React, { ReactNode } from "react";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacityProps,
    View,
} from "react-native";
import {
    DefaultTheme,
    Button as PaperButton,
    useTheme,
} from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { StyleProps } from "react-native-reanimated";

interface ButtonProps extends TouchableOpacityProps {
    type?: "primary" | "secondary" | "link";
    icon?: ReactNode | undefined;
    text?: string;
    textStyle?: StyleProps;
    buttonStyle?: StyleProps;
    children?: ReactNode;
}

// Extiende la interfaz base para requerir el campo 'text'
interface WithText extends ButtonProps {
    text: string;
    children?: never; // Indica que 'children' no debe estar presente cuando 'text' está presente
}

// Extiende la interfaz base para requerir el campo 'children'
interface WithChildren extends ButtonProps {
    text?: never; // Indica que 'text' no debe estar presente cuando 'children' está presente
    children: ReactNode;
}

export default function Button({
    type = "primary",
    onPress,
    icon,
    text,
    textStyle,
    buttonStyle,
    children,
}: ButtonProps) {
    const theme: DefaultTheme = useTheme();

    const styles = StyleSheet.create({
        button: {
            borderColor: type === "link" ? "transparent" : theme.colors.primary,
            borderWidth: 1,
            backgroundColor:
                type === "primary"
                    ? theme.colors.primary
                    : type === "link"
                    ? "transparent"
                    : theme.colors.primaryContrast,
            // justifyContent: "center",
            // alignItems: "center",
            borderRadius: 5,
            width: "100%",
        },
        text: {
            color:
                type === "primary"
                    ? theme.colors.primaryContrast
                    : theme.colors.primary,
            width: "100%",
        },
    });

    if (type === "link") {
        return (
            <Pressable onPress={onPress} style={[styles.button, buttonStyle]}>
                {icon && icon}
                {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
                {children && children}
            </Pressable>
        );
    }
    return (
        <PaperButton
            style={[styles.button, buttonStyle]}
            icon={() => icon}
            onPress={onPress}
        >
            {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
            {children && children}
        </PaperButton>
    );
}
