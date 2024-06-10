import { Language } from "../contexts/UserContext";
import { getLocale } from "./functions";

/**
 * function to give format to date fields
 *
 * @param value
 * @returns
 */
export function setDateFormat({
    value,
    language,
}: {
    value: Date;
    language: Language;
}): string {
    const date = new Date(value);
    const locale = getLocale({ locale: language });
    const newDate = new Intl.DateTimeFormat(locale).format(date);
    return newDate;
}

export function formatPrices({
    number,
    language,
}: {
    number: number;
    language: Language;
}): string {
    const locale = getLocale({ locale: language });
    return parseFloat(number?.toFixed(2)).toLocaleString(locale);
}
