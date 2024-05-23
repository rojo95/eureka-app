import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import Budgets from "../../screens/CMRSales/Budgets/Budgets";
import HomeScreen from "../../screens/Home/Home";
import CustomDrawer from "./CustomDrawer";
import CreateBudget from "../../screens/CMRSales/Budgets/CreateBudget/CreateBudget";
import Configs from "../../screens/Configs/Configs";
import { FontAwesome } from "@expo/vector-icons";
import { DefaultTheme, useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const LeftDrawer = createDrawerNavigator();

export default function LeftDrawerScreen() {
    const { t } = useTranslation();
    const navigation: any = useNavigation();
    const theme: DefaultTheme = useTheme();
    return (
        <LeftDrawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                drawerPosition: "left",
                drawerStyle: {
                    backgroundColor: "#3C414F", // Cambia este valor al color que desees
                },
            }}
        >
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
                        <FontAwesome name="filter" size={24} color="black" />
                    ),
                }}
            />
            <LeftDrawer.Screen
                name="configs"
                component={Configs}
                options={{ title: t("menu-title-config") }}
            />
            <LeftDrawer.Screen
                name="createBudget"
                options={{
                    title: t("menu-title-create-budget"),
                    headerRight: () => (
                        <FontAwesome
                            onPress={() => navigation.navigate("budgets")}
                            name="arrow-left"
                            size={24}
                            color={theme.colors.dark}
                        />
                    ),
                }}
                component={CreateBudget}
            />
        </LeftDrawer.Navigator>
    );
}
