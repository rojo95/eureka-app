import i18next from "../services/languages/i18next";

export default async function changeLanguage(lang: string) {
    try {
        i18next.changeLanguage(lang);
    } catch (e) {
        return e;
    }
}
