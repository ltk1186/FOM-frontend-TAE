import React, { useState, createContext } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loginUser = (userData) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{ user, loginUser, logoutUser: () => setUser(null) }}
        >
            {children}
        </UserContext.Provider>
    );
};
export default UserContext;
