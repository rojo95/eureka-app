import { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import Budgets from "../../screens/CMRSales/Budgets/Budgets";
import HomeScreen from "../../screens/Home/Home";
import CustomDrawer from "./CustomDrawer";
import Configs from "../../screens/Configs/Configs";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { DefaultTheme, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import LoginScreen from "../../screens/Login/Login";
import { UserContext } from "../../contexts/UserContext";
import DetailsBudget from "../../screens/CMRSales/Budgets/DetailsBudget/DetailsBudget";
const LeftDrawer = createDrawerNavigator();

export default function LeftDrawerScreen() {
    const { t } = useTranslation();
    const navigation: any = useNavigation();
    const theme: DefaultTheme = useTheme();
    const { user } = useContext(UserContext);

    return (
        <LeftDrawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            initialRouteName={"home"}
            screenOptions={{
                drawerPosition: "left",
                drawerStyle: {
                    backgroundColor: theme.colors.darkGrey,
                },
            }}
        >
            {user ? (
                <>
                    <LeftDrawer.Screen
                        name="home"
                        component={HomeScreen}
                        options={{ title: t("menu-title-home") }}
                    />
                    <LeftDrawer.Screen
                        name="budgets"
                        component={Budgets}
                        options={{
                            title: t("menu-title-budgets"),
                            headerRight: () => (
                                <FontAwesome
                                    name="filter"
                                    size={24}
                                    color="black"
                                />
                            ),
                        }}
                    />
                    <LeftDrawer.Screen
                        name="budget"
                        component={DetailsBudget}
                        options={{
                            title: t("menu-title-budgets"),
                            headerRight: () => (
                                <Entypo
                                    name="dots-three-horizontal"
                                    size={24}
                                    color="black"
                                />
                            ),
                        }}
                        initialParams={{ itemId: null }}
                    />
                    <LeftDrawer.Screen
                        name="configs"
                        component={Configs}
                        options={{ title: t("menu-title-config") }}
                    />
                </>
            ) : (
                <LeftDrawer.Screen
                    name="login"
                    options={{
                        swipeEnabled: false,
                        title: t("button-login"),
                        headerRight: () => (
                            <FontAwesome
                                onPress={() => navigation.navigate("budgets")}
                                name="arrow-left"
                                size={24}
                                color={theme.colors.dark}
                            />
                        ),
                        headerShown: false,
                    }}
                    component={LoginScreen}
                />
            )}
        </LeftDrawer.Navigator>
    );
}
