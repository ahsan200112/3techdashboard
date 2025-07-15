// LoadingContext.js
import React, { createContext, useState, useContext } from "react";
import { loadingManager } from "./loadingManager";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  loadingManager.register(setLoading);

  return (
    <LoadingContext.Provider value={{ loading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
