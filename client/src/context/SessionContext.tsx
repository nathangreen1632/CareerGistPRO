import React, { createContext, useContext } from 'react';
import { useSessionManager } from '../hooks/useSessionManager';

const SessionContext = createContext<ReturnType<typeof useSessionManager> | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const session = useSessionManager();

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
