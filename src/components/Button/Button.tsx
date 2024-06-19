import React, { ReactNode } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacityProps,
} from "react-native";
import {
    DefaultTheme,
    Button as PaperButton,
    useTheme,
} from "react-native-paper";
import { StyleProps } from "react-native-reanimated";

interface ButtonPropsBase extends TouchableOpacityProps {
    type?: "primary" | "secondary" | "link";
    icon?: ReactNode | undefined;
    text?: string;
    textStyle?: StyleProps;
    buttonStyle?: StyleProps;
    children?: ReactNode;
}

// Extends the base interface to require the field 'text'.
interface WithText extends ButtonPropsBase {
    icon?: ReactNode;
    text: string;
    children?: ReactNode;
}

// Extends the base interface to require the 'children' field
interface WithChildren extends ButtonPropsBase {
    icon?: ReactNode;
    text?: string;
    children: ReactNode;
}

// Extends the base interface to require the 'icon' field
interface WithIcon extends ButtonPropsBase {
    icon: ReactNode;
    text?: string;
    children?: ReactNode;
}

type ButtonProps = WithText | WithChildren | WithIcon;

export default function Button({
    type = "primary",
    onPress,
    icon,
    text,
    textStyle,
    buttonStyle,
    children,
    disabled,
}: ButtonProps) {
    const theme: DefaultTheme = useTheme();

    const styles = StyleSheet.create({
        button: {
            borderColor:
                type === "link"
                    ? "transparent"
                    : disabled
                    ? theme.colors.primaryLight
                    : theme.colors.primary,
            borderWidth: 1,
            backgroundColor:
                type === "primary"
                    ? disabled
                        ? theme.colors.primaryLight
                        : theme.colors.primary
                    : type === "link"
                    ? "transparent"
                    : theme.colors.primaryContrast,
            borderRadius: 5,
            width: "100%",
        },
        text: {
            color:
                type === "primary"
                    ? theme.colors.primaryContrast
                    : disabled
                    ? theme.colors.primaryLight
                    : theme.colors.primary,
            width: "100%",
        },
    });

    if (type === "link") {
        return (
            <Pressable
                disabled={disabled}
                onPress={onPress}
                style={[styles.button, buttonStyle]}
            >
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
            disabled={disabled}
        >
            {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
            {children && children}
        </PaperButton>
    );
}
