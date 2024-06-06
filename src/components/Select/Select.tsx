import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Menu, Button, DefaultTheme, useTheme } from "react-native-paper";
import { StyleProps } from "react-native-reanimated";
import Text from "../Text/Text";
import { useTranslation } from "react-i18next";

interface SelectionProps {
    options: string[] | { id: string; description: string }[];
    onSelect: (value: string) => void;
    selectedValue: string;
    buttonStyle?: StyleProps;
    placeholder?: string;
    label?: string;
}

const Select: React.FC<SelectionProps> = ({
    options,
    onSelect,
    selectedValue,
    buttonStyle,
    placeholder,
    label,
}) => {
    const { t } = useTranslation();
    const placeHolder = placeholder || t("select-list-item");
    const theme: DefaultTheme = useTheme();
    const [visible, setVisible] = useState(false);

    const themedStyles = StyleSheet.create({
        text: { color: theme.colors.dark },
        fieldLabel: {
            backgroundColor: theme.colors.primaryContrast,
        },
    });

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View style={[styles.container, buttonStyle]}>
            <Text style={[styles.fieldLabel, themedStyles.fieldLabel]}>
                {label}
            </Text>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <Button
                        onPress={openMenu}
                        contentStyle={[styles.button, buttonStyle]}
                        icon={!visible ? "chevron-down" : "chevron-up"}
                    >
                        <Text style={[themedStyles.text]}>
                            {(typeof options[0] === "string"
                                ? selectedValue
                                : (
                                      options as {
                                          id: string;
                                          description: string;
                                      }[]
                                  )?.find((v) => v.id === selectedValue)
                                      ?.description || selectedValue) ||
                                placeHolder}
                        </Text>
                    </Button>
                }
            >
                <Menu.Item title={placeHolder} />
                {options.map((option, index) => (
                    <Menu.Item
                        key={index}
                        onPress={() => {
                            onSelect(
                                typeof option === "string" ? option : option.id
                            );
                            closeMenu();
                        }}
                        title={
                            typeof option === "string"
                                ? option
                                : option.description
                        }
                    />
                ))}
            </Menu>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderWidth: 1,
        borderRadius: 3,
    },
    button: {
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        width: "100%",
    },
    fieldLabel: {
        position: "absolute",
        top: -9,
        left: 8,
        paddingHorizontal: 5,
        fontSize: 12,
    },
});

export default Select;
