import { createContext, useEffect, useState } from "react";
import { getToken, removeToken } from "../services/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken();
            if(token)
                setUserToken(token);

            setLoading(false);
        };
        checkToken();
    }, []);

    const logout = async () => {
        await removeToken();
        setUserToken(null);
        setIsLoggedIn(false)
    }

    const login = async(token)=>{
        setUserToken(token);
        setIsLoggedIn(true)
    }

    return (
        <AuthContext.Provider 
            value={{ 
                userToken, 
                loading, 
                login, 
                logout,
                isLoggedIn
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};