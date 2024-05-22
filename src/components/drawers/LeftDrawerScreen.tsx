import { createDrawerNavigator } from "@react-navigation/drawer";
import Budgets from "../../screens/CMRSales/Budgets/Budgets";
import HomeScreen from "../../screens/Home/Home";
import CustomDrawer from "./CustomDrawer";
import CreateBudget from "../../screens/CMRSales/Budgets/CreateBudget/CreateBudget";

const LeftDrawer = createDrawerNavigator();

export default function LeftDrawerScreen() {
    return (
        <LeftDrawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} />}
            screenOptions={{
                drawerPosition: "left",
                drawerStyle: {
                    backgroundColor: "#3C414F", // Cambia este valor al color que desees
                    drawerInactiveTintColor: "#fff",
                },
            }}
        >
            <LeftDrawer.Screen name="home" component={HomeScreen} />
            <LeftDrawer.Screen name="createBudget" component={CreateBudget} />
            <LeftDrawer.Screen
                name="budgets"
                component={Budgets}
                options={{ title: "Presupuestos" }}
            />
        </LeftDrawer.Navigator>
    );
}
