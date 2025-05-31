import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 🔹 로딩 상태 추가

  const loginUser = ({ user_id }) => {
    setUser({ user_id });
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        isLoading,
        setIsLoading, // 🔹 전달
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
