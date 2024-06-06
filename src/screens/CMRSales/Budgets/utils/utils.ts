import { DefaultTheme } from "react-native-paper";

export function getBackgroundColorState({
    statusId,
    theme,
}: {
    statusId: number;
    theme: DefaultTheme;
}) {
    switch (statusId) {
        case 1:
            return theme.colors.primaryLight;
        case 2:
            return theme.colors.deepBlueLight;
        case 4:
            return theme.colors.dangerLight;
        default:
            return theme.colors.successLight;
    }
}
