import { Platform } from "react-native";
import {
    MD3LightTheme as DefaultTheme,
    configureFonts,
} from "react-native-paper";

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

// custom Theme
const Theme = {
    ...DefaultTheme,
    fonts: configureFonts({ config: fontConfig }),
    // Specify custom property
    myOwnProperty: true,
    // Specify custom property in nested object
    colors: {
        ...DefaultTheme.colors,
        primary: "#F39200",
        dark: "#121d29",
        darkGrey: "#3C414F",
        background: "#FFF",
        backgroundCard: "#FFF",
        secondaryButton: "#FFF",
    },
};

export default Theme;
