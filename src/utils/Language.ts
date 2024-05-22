import i18next from "../../services/i18next";

export default async function changeLanguage(lang: string) {
    try {
        i18next.changeLanguage(lang);
    } catch (e) {
        return e;
    }
}
