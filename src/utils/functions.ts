import { Language } from "../contexts/UserContext";

/**
 * Function to create an URL with params
 *
 * @param param0
 * @param {URL} param.urlBase
 * @param {object} param.param
 * @returns
 */
export function createUrl({
    urlBase,
    params,
}: {
    urlBase: URL;
    params: object;
}) {
    // create a new URLSearchParams object
    const searchParams = new URLSearchParams();

    // Add parameters to the URLSearchParams object
    for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, value!);
    }

    // merge and return the URLSearchParams object to the URL
    return `${urlBase}?${searchParams.toString()}`;
}

export const getLocale = ({ locale }: { locale: Language }) =>
    locale === "es" ? "es-ES" : "en-US";
