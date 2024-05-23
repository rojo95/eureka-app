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
    // Función recursiva para buscar el componente TextInput
    function recursiveFind(component: any): any {
        if (component.type === value) {
            return component;
        }

        // Recursivamente busca en cada hijo del componente actual
        for (const child of component.children || []) {
            const found = recursiveFind(child);
            if (found) {
                return found;
            }
        }

        return null;
    }

    // Comienza la búsqueda desde el árbol raíz
    return recursiveFind(object);
}
