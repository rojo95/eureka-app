import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTranslation } from "react-i18next";
import Budgets from "../../screens/CMRSales/Budgets/Budgets";
import HomeScreen from "../../screens/Home/Home";
import CustomDrawer from "./CustomDrawer";
import CreateBudget from "../../screens/CMRSales/Budgets/CreateBudget/CreateBudget";
import Configs from "../../screens/Configs/Configs";

const LeftDrawer = createDrawerNavigator();

export default function LeftDrawerScreen() {
    const { t } = useTranslation();
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
                name="configs"
                component={Configs}
                options={{ title: t("menu-title-config") }}
            />
            <LeftDrawer.Screen name="createBudget" component={CreateBudget} />
            <LeftDrawer.Screen
                name="budgets"
                component={Budgets}
                options={{ title: t("menu-title-budgets") }}
            />
        </LeftDrawer.Navigator>
    );
}
