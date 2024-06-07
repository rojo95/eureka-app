import { DefaultTheme } from "react-native-paper";

export function getColorState({
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

/**
 * Function to calculate K total
 * @param param0
 * @param { number } param.totalCost
 * @param { number } param.totalSale
 * @returns
 */
export const calculateKTotal = ({
    totalCost,
    totalSale,
}: {
    totalCost: number;
    totalSale: number;
}) => {
    return totalSale / totalCost;
};

/**
 * Function to calculate the Margin Profit
 * @param param0
 * @param { number } param.totalCost
 * @param { number } param.totalSale
 * @returns
 */
export const calculateMarginProfit = ({
    totalCost,
    totalSale,
}: {
    totalCost: number;
    totalSale: number;
}) => {
    const kTotal = calculateKTotal({ totalCost, totalSale });
    if (!kTotal) return 0;
    return (1 - 1 / kTotal) * 100;
};
