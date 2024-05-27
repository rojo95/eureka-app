import { createContext, useState, useEffect, ReactNode } from "react";
import { getSecureData } from "../services/storeData/storeData";
import { login as loginFn, logout as logoutFn } from "../utils/login";
import { getUserData } from "../services/users/users";
import sessionNames from "../utils/sessionInfo";

const { userKey } = sessionNames;

type User = {
    id: number;
    rol: string;
    name: string;
    lastName: string;
};

type UserContextValue = {
    user: User | null;
    login: (loginProps: LoginProps) => Promise<boolean>;
    logout: () => void;
};

type LoginProps = {
    email: string;
    password: string;
};

const UserContext = createContext<UserContextValue>({
    user: null,
    login: async (): Promise<boolean> => {
        return false;
    },

    logout: () => {},
});

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const fetchUser = async () => {
        const userData = await getSecureData(userKey);
        if (userData) {
            const {
                type: rol,
                name,
                lastName,
            } = await getUserData({
                userId: parseInt(userData),
            });
            setUser({ id: parseInt(userData), rol, name, lastName });
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (loginProps: LoginProps) => {
        try {
            const response = await loginFn(loginProps);
            if (response) {
                const { id, type: rol, name, lastName } = response;
                setUser({ id: parseInt(id), rol, name, lastName });
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        logoutFn();
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
