import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RightDrawerScreen from "./src/components/drawers/RightDrawerScreen";

export default function App() {
    return (
        <NavigationContainer>
            <RightDrawerScreen />
        </NavigationContainer>
    );
}
