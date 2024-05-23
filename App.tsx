import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { I18nextProvider } from "react-i18next";
import {
    MD3LightTheme as DefaultTheme,
    PaperProvider,
    configureFonts,
} from "react-native-paper";
import RightDrawerScreen from "./src/components/drawers/RightDrawerScreen";
import i18n from "./services/i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import changeLanguage from "./src/utils/Language";
import { Platform } from "react-native";

const fontConfig: any = {
    customVariant: {
        fontFamily: Platform.select({
            web: "Manrope",
            ios: "System",
            default: "Manrope",
        }),
        fontWeight: "400", // Change this line if needed based on the expected types
        letterSpacing: 0.5,
        lineHeight: 22,
        fontSize: 20,
    },
};

// custom theme
const theme = {
    ...DefaultTheme,
    fonts: configureFonts({ config: fontConfig }),
    // Specify custom property
    myOwnProperty: true,
    // Specify custom property in nested object
    colors: {
        ...DefaultTheme.colors,
        primary: "#F39200",
        dark: "#0D141C",
        darkGrey: "#3C414F",
    },
};

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
