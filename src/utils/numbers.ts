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

export const calculateKTotal = ({
    totalCost,
    totalSale,
}: {
    totalCost: number;
    totalSale: number;
}) => {
    return totalSale / totalCost;
};

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

export function formatDecimal({
    number,
    locale = "es-ES",
}: {
    number: number;
    locale?: string;
}) {
    return parseFloat(number.toFixed(2)).toLocaleString(locale);
}
