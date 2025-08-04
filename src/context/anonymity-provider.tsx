"use client"

import * as React from "react"

type AnonymityContextType = {
  isAnonymous: boolean
  setIsAnonymous: (isAnonymous: boolean) => void
}

const AnonymityContext = React.createContext<AnonymityContextType | undefined>(undefined);

export function AnonymityProvider({ children }: { children: React.ReactNode }) {
  const [isAnonymous, setIsAnonymousState] = React.useState(false);

  React.useEffect(() => {
    const storedValue = localStorage.getItem("isAnonymous");
    if (storedValue) {
      setIsAnonymousState(JSON.parse(storedValue));
    }
  }, []);

  const setIsAnonymous = (newValue: boolean) => {
    setIsAnonymousState(newValue);
    localStorage.setItem("isAnonymous", JSON.stringify(newValue));
  };
  
  return (
    <AnonymityContext.Provider value={{ isAnonymous, setIsAnonymous }}>
      {children}
    </AnonymityContext.Provider>
  )
}

export function useAnonymity() {
    const context = React.useContext(AnonymityContext);
    if (context === undefined) {
        throw new Error('useAnonymity must be used within an AnonymityProvider');
    }
    return context;
}
