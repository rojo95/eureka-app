import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import es from "../locales/es.json";
import { Resources } from "i18next-resources-for-ts";

export const languageResources: Resources = {
    en: { translation: en },
    es: { translation: es },
};

i18next.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "es",
    resources: languageResources,
});

export default i18next;