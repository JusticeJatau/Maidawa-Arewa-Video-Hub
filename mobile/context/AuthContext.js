import { createContext, useEffect, useState } from "react";
import { getToken, getUser, removeToken, getBackendData, removeUser } from "../services/auth";
import { Alert } from "react-native";
import { SERVER_BASE, api } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [backend, setBackend] = useState(null);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const token = await getToken();
            const user_info = await getUser();

            if(token && user_info){
                setUserToken(token);
                setUser(user_info);
                setIsLoggedIn(true);
            }

            try{
                const backendConfig = await api.get(`${SERVER_BASE}/config.json`)
                setBackend(backendConfig.data)
                console.log("Config Data",backendConfig.data)
            }catch(err){
                console.log("Failed to fecth backend config: ", err)

                const backendConfig = await getBackendData();
                setBackend(backendConfig)
            }

            setLoading(false);
        };
        init();
    }, []);

    const logout = async () => {
        await removeToken();
        setUserToken(null);
        setIsLoggedIn(false)
        removeUser()
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
                backend,
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