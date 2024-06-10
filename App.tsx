import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { I18nextProvider } from "react-i18next";
import { PaperProvider } from "react-native-paper";
import i18n from "./src/services/languages/i18next";
import CustomTheme from "./src/theme/Theme";
import { UserProvider } from "./src/contexts/UserContext";
import LeftDrawerScreen from "./src/contexts/Navigation/LeftDrawerScreen";
import { SharedParamsProvider } from "./src/contexts/SharedParamsProvider";
import { RootSiblingParent } from "react-native-root-siblings";
import { en, registerTranslation } from "react-native-paper-dates";

const theme = CustomTheme;
registerTranslation("en", en);

export default function App() {
    return (
        <SharedParamsProvider>
            <PaperProvider theme={theme}>
                <I18nextProvider i18n={i18n}>
                    <UserProvider>
                        <NavigationContainer>
                            <RootSiblingParent>
                                <LeftDrawerScreen />
                            </RootSiblingParent>
                        </NavigationContainer>
                    </UserProvider>
                </I18nextProvider>
            </PaperProvider>
        </SharedParamsProvider>
    );
}
