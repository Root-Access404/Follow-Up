import { useState } from "react";
import { AuthContext as AuthContextValue } from "./AuthContextValue.jsx";

const AuthContext = AuthContextValue;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Failed to parse saved user:", error);
            localStorage.removeItem("user");
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("token") || null;
    });

    const login = (userData) => {
        const authToken = userData?.token || localStorage.getItem("token");

        setUser(userData?.user || userData || null);
        setToken(authToken);

        if (userData?.user) {
            localStorage.setItem("user", JSON.stringify(userData.user));
        }

        if (authToken) {
            localStorage.setItem("token", authToken);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: Boolean(token),
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext };