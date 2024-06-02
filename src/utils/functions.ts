/**
 * function to find component
 * @param param0
 * @returns
 */
export function findComponentByType({
    object,
    value,
}: {
    object: any;
    value: string;
}): any {
    // Recursive function to search for the component
    function recursiveFind(component: any): any {
        if (component.type === value) {
            return component;
        }

        // Recursively searches each child of the current component
        for (const child of component.children || []) {
            const found = recursiveFind(child);
            if (found) {
                return found;
            }
        }

        return null;
    }

    return recursiveFind(object);
}

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
