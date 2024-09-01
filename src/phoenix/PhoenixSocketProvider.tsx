import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { PhoenixRepo } from './PhoenixRepo';

const PhoenixSocketContext = createContext<PhoenixRepo | null>(null);

interface PhoenixSocketProviderProps {
  url: string;
  params?: object;
  connect?: boolean;
  children: React.ReactNode;
}

export const PhoenixSocketProvider: React.FC<PhoenixSocketProviderProps> = ({
  url,
  params,
  connect = true,
  children,
}) => {
  const phoenix = useMemo(() => {
    return new PhoenixRepo(url, params);
  }, [url, params]);

  useEffect(() => {
    if (connect) {
      phoenix.connect();
    }

    return () => {
      if (connect) {
        phoenix.disconnect();
      }
    };
  }, [phoenix, connect]);

  return (
    <PhoenixSocketContext.Provider value={phoenix}>
      {children}
    </PhoenixSocketContext.Provider>
  );
};

export const usePhoenixSocket = () => useContext(PhoenixSocketContext)!;
