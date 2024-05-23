import { DefaultTheme } from "react-native-paper";

interface CustomColors {
    dark: string;
    darkGrey: string;
    background: string;
    backgroundCard: string;
}

declare module "react-native-paper" {
    export interface DefaultTheme {
        colors: CustomColors & DefaultTheme["colors"];
    }
}
