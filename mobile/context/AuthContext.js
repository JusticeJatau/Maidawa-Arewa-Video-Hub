import { createContext, useEffect, useState } from "react";
import { getToken, getUser, removeToken } from "../services/auth";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken();
            const user_info = await getUser();
            console.log("User info on app start:", user_info);
            if(token && user_info){
                setUserToken(token);
                setUser(user_info);
                setIsLoggedIn(true);
            }

            setLoading(false);
        };
        checkToken();
    }, []);

    const logout = async () => {
        await removeToken();
        setUserToken(null);
        setIsLoggedIn(false)
    }

    const login = async(token, user_info) => {
        setUserToken(token);
        setUser(user_info);
        setIsLoggedIn(true);
    }

    return (
        <AuthContext.Provider 
            value={{ 
                userToken,
                user, 
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