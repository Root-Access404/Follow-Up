import { useContext } from "react";
import { AuthContext } from "./AuthContextValue.jsx";

const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};

export { useAuth };
export default useAuth;