import React, { createContext, useContext, useState, ReactNode } from "react";

export interface UserData {
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  updateUserData: (data: Partial<UserData>) => void;
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>({
    fullName: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
  });

  const setUserData = (data: UserData) => {
    setUserDataState(data);
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserDataState((prev) => (prev ? { ...prev, ...data } : null));
  };

  const clearUserData = () => {
    setUserDataState(null);
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        updateUserData,
        clearUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
