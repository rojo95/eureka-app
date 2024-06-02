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
