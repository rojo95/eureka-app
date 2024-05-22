import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RightDrawerScreen from "./src/components/drawers/RightDrawerScreen";
import { I18nextProvider } from "react-i18next";
import i18n from "./services/i18next";

export default function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <NavigationContainer>
                <RightDrawerScreen />
            </NavigationContainer>
        </I18nextProvider>
    );
}
