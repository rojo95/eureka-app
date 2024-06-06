import AsyncStorage from "@react-native-async-storage/async-storage";
import sessionNames from "../utils/sessionInfo";

/**
 * function to give format to date fields
 *
 * @param value
 * @returns
 */
export function setDateFormat(value: any): string {
    const text = new Date(value);
    const day = text.getDate().toString().padStart(2, "0");
    const month = (text.getMonth() + 1).toString().padStart(2, "0");
    const year = text.getFullYear();
    const finalDate = `${day}-${month}-${year}`;
    return finalDate;
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

export async function formatPrices({
    number,
}: {
    number: number;
}): Promise<string> {
    const { lang } = sessionNames;

    const selectedLang = await AsyncStorage.getItem(lang);

    const locale = selectedLang === "es" ? "es-ES" : "en-US";

    return parseFloat(number.toFixed(2)).toLocaleString(locale);
}
