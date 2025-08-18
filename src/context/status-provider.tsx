
"use client"

import * as React from "react"
import type { User } from "@/lib/data"
import { currentUser } from "@/lib/data";

type StatusContextType = {
  status: User['status'];
  setStatus: (status: User['status']) => void;
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
}

const StatusContext = React.createContext<StatusContextType | undefined>(undefined);

export function StatusProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(currentUser);
  
  React.useEffect(() => {
    try {
        const storedStatus = localStorage.getItem("guardianlink-user-status");
        if (storedStatus && (storedStatus === 'safe' || storedStatus === 'help' || storedStatus === 'danger')) {
            setUser(prevUser => ({...prevUser, status: storedStatus}));
        }
    } catch (error) {
        console.error("Failed to load status from localStorage", error);
    }
  }, []);

  const setStatus = (newStatus: User['status']) => {
    setUser(prevUser => {
        const updatedUser = {...prevUser, status: newStatus};
        try {
             localStorage.setItem("guardianlink-user-status", newStatus);
        } catch (error) {
             console.error("Failed to save status to localStorage", error);
        }
        return updatedUser;
    });
  };
  
  return (
    <StatusContext.Provider value={{ status: user.status, setStatus, currentUser: user, setCurrentUser: setUser }}>
      {children}
    </StatusContext.Provider>
  )
}

export function useStatus() {
    const context = React.useContext(StatusContext);
    if (context === undefined) {
        throw new Error('useStatus must be used within a StatusProvider');
    }
    return context;
}
