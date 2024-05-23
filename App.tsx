import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { I18nextProvider } from "react-i18next";
import {
    PaperProvider,
} from "react-native-paper";
import RightDrawerScreen from "./src/components/drawers/RightDrawerScreen";
import i18n from "./services/i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import changeLanguage from "./src/utils/Language";
import CustomTheme from "./src/theme/Theme";

const theme = CustomTheme;

export default function App() {
    async function setLanguage() {
        const lng = (await AsyncStorage.getItem("lang")) || "es";
        changeLanguage(lng);
    }
    React.useEffect(() => {
        setLanguage();
    }, []);
    return (
        <PaperProvider theme={theme}>
            <I18nextProvider i18n={i18n}>
                <NavigationContainer>
                    <RightDrawerScreen />
                </NavigationContainer>
            </I18nextProvider>
        </PaperProvider>
    );
}
