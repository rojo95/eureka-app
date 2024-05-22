import React, { ReactNode } from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacityProps,
} from "react-native";
import {
    DefaultTheme,
    Button as PaperButton,
    useTheme,
} from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { StyleProps } from "react-native-reanimated";

interface ButtonProps extends TouchableOpacityProps {
    icon?: IconSource | undefined;
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

// Combina ambas interfaces en un tipo de unión
type RequiredOneOfTwoFields = WithText | WithChildren;

export default function Button({
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
            borderColor: theme.colors.primary,
            borderWidth: 1,
            backgroundColor: "#FFF",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
        },
        text: {
            color: theme.colors.primary,
        },
    });

    return (
        <PaperButton
            style={[styles.button, buttonStyle]}
            onPress={onPress}
            icon={icon}
        >
            {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
            {children}
        </PaperButton>
    );
}
