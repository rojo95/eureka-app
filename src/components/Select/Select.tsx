import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
    Menu,
    Button,
    Divider,
    DefaultTheme,
    useTheme,
} from "react-native-paper";
import { StyleProps } from "react-native-reanimated";
import { Text } from "../Text/Text";

interface SelectionProps {
    options: string[] | { id: string; description: string }[];
    onSelect: (value: string) => void;
    selectedValue: string;
    buttonStyle?: StyleProps;
}

const Select: React.FC<SelectionProps> = ({
    options,
    onSelect,
    selectedValue,
    buttonStyle,
}) => {
    const theme: DefaultTheme = useTheme();
    const [visible, setVisible] = useState(false);

    const styles = StyleSheet.create({
        container: {
            // flex: 1,
            width: "100%",
            borderWidth: 1,
            borderRadius: 5,
        },
        button: {
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            width: "100%",
        },
        text: { color: theme.colors.dark },
    });

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <View style={[styles.container, buttonStyle]}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <Button
                        onPress={openMenu}
                        contentStyle={[styles.button, buttonStyle]}
                        icon={!visible ? "chevron-down" : "chevron-up"}
                    >
                        <Text style={styles.text}>{selectedValue}</Text>
                    </Button>
                }
            >
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

export default Select;
