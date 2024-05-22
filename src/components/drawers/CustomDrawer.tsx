import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

export default function CustomDrawer(props: any) {
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
                activeBackgroundColor="#636772" // Color de fondo cuando el item está activo
                activeTintColor="#FFFFFF" // Color del texto cuando el item está activo
                inactiveTintColor="#FFFFFF" // Color del texto cuando el item está inactivo
                focused={isActiveRoute("home")}
                icon={() => <AntDesign name="home" size={24} color="white" />}
            />
            <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                style={{
                    flex: 1,
                    padding: 10,
                    paddingLeft: 19,
                    backgroundColor: isActiveRoute("budgets") ? "#636772" : "",
                    marginVertical: 5,
                    marginRight: 10,
                    borderTopEndRadius: 4,
                    borderBottomEndRadius: 4,
                    flexDirection: "row",
                    alignItems: "center",
                }}
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
            </TouchableOpacity>
            {isExpanded && (
                <View>
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("budgets")}
                        style={{
                            padding: 10,
                            backgroundColor: isActiveRoute("budgets")
                                ? "#636772"
                                : "",
                        }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                            }}
                        >
                            {t("menu-title-budgets")}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
            <DrawerItem
                label={t("menu-title-config")}
                onPress={() => props.navigation.navigate("configs")}
                activeBackgroundColor="#636772" // Color de fondo cuando el item está activo
                activeTintColor="#FFFFFF" // Color del texto cuando el item está activo
                inactiveTintColor="#FFFFFF" // Color del texto cuando el item está inactivo
                focused={isActiveRoute("configs")}
                icon={() => (
                    <MaterialCommunityIcons
                        name="cog-outline"
                        size={24}
                        color="white"
                    />
                )}
            />
        </DrawerContentScrollView>
    );
}
