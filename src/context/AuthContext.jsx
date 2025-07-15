import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/latestApi"
const AuthContext = createContext({});


export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [storeData, setStoreData] = useState(null);

    const getUser = async () => {
        const response = await api.get("/api/customers/getUser");
        if (response.code === 200) {
            setUserData(response.data?.customer);
            setStoreData(response.data?.store);
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <AuthContext.Provider value={{ setStoreData, setUserData, storeData, userData }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)