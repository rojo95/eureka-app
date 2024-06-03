import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    createContext,
    useState,
} from "react";

interface BudgetContextType {
    contextParams: any;
    setContextParams: Dispatch<SetStateAction<any>>;
}

// Crear el contexto
export const ParamsContext = createContext<BudgetContextType | undefined>(
    undefined
);

// Crear un proveedor para el contexto
export const SharedParamsProvider = ({ children }: { children: ReactNode }) => {
    const [contextParams, setContextParams] = useState<any>({});

    return (
        <ParamsContext.Provider value={{ contextParams, setContextParams }}>
            {children}
        </ParamsContext.Provider>
    );
};
