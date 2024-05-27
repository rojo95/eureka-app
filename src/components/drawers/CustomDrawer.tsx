import React, { useContext, useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { DefaultTheme, useTheme } from "react-native-paper";
import { UserContext } from "../../contexts/UserContext";

export default function CustomDrawer(props: any) {
    const { logout } = useContext(UserContext);
    const theme: DefaultTheme = useTheme();
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    const getCurrentRouteName = () => {
        const route =
            props.navigation.getState().routes[
                props.navigation.getState().index
            ];
        return route.name;
    };

    function isActiveRoute(name: string) {
        const active = name === getCurrentRouteName();
        return active;
    }

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem
                label={t("menu-title-home")}
                onPress={() => props.navigation.navigate("home")}
                activeBackgroundColor={theme.colors.darkGrey}
                activeTintColor="#FFFFFF" // Color del texto cuando el item está activo
                inactiveTintColor="#FFFFFF" // Color del texto cuando el item está inactivo
                focused={isActiveRoute("home")}
                icon={() => <AntDesign name="home" size={24} color="white" />}
            />
            <Pressable
                onPress={() => setIsExpanded(!isExpanded)}
                style={[
                    styles.item,
                    {
                        backgroundColor: isActiveRoute("budgets")
                            ? "#636772"
                            : theme.colors.darkGrey,
                    },
                ]}
            >
                <MaterialCommunityIcons
                    name="view-dashboard-outline"
                    size={24}
                    color="white"
                />
                <Text
                    style={{
                        color: "#FFFFFF",
                        marginLeft: 5,
                    }}
                >
                    {t("menu-title-cmr-sales")}
                </Text>
            </Pressable>
            {isExpanded && (
                <View>
                    <Pressable
                        onPress={() => props.navigation.navigate("budgets")}
                        style={[
                            styles.itemSon,
                            {
                                backgroundColor: isActiveRoute("budgets")
                                    ? "#636772"
                                    : theme.colors.darkGrey,
                            },
                        ]}
                    >
                        <MaterialCommunityIcons
                            name="calculator-variant"
                            size={24}
                            color="white"
                        />
                        <Text
                            style={{
                                color: "#fff",
                            }}
                        >
                            {t("menu-title-budgets")}
                        </Text>
                    </Pressable>
                </View>
            )}
            <DrawerItem
                label={t("menu-title-config")}
                onPress={() => props.navigation.navigate("configs")}
                activeBackgroundColor="#636772" // Color de fondo cuando el item está activo
                activeTintColor={theme.colors.primaryContrast} // Color del texto cuando el item está activo
                inactiveTintColor={theme.colors.primaryContrast} // Color del texto cuando el item está inactivo
                focused={isActiveRoute("configs")}
                icon={() => (
                    <MaterialCommunityIcons
                        name="cog-outline"
                        size={24}
                        color="white"
                    />
                )}
            />
            <View>
                <Pressable
                    onPress={async () => {
                        await logout();
                        props.navigation.navigate("login");
                    }}
                    style={[styles.item]}
                >
                    <MaterialCommunityIcons
                        name="logout"
                        size={24}
                        color="white"
                    />
                    <Text
                        style={{
                            color: theme.colors.primaryContrast,
                            marginLeft: 5,
                        }}
                    >
                        {t("logout")}
                    </Text>
                </Pressable>
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        padding: 10,
        paddingLeft: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 4,
        flexDirection: "row",
        alignItems: "center",
    },
    itemSon: {
        paddingVertical: 10,
        paddingLeft: 40,
        paddingRight: 5,
        flexDirection: "row",
        alignItems: "center",
    },
});
