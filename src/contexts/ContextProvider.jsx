import { createContext, useContext, useState } from "react";

// Create context
const stateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
});

// Main Provider Component
export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    // const [token, _setToken] = useState(123);

    const setToken = (token) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    const contextValue = {
        user,
        token,
        setUser,
        setToken,
    };

    return (
        <stateContext.Provider value={contextValue}>
            {children}
        </stateContext.Provider>
    );
}

// Custom Hook for accessing context easily
export const useStateContext = () => useContext(stateContext);

