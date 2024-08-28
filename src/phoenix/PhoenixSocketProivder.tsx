import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { PhoenixRepo } from './PhoenixRepo';

const PhoenixSocketContext = createContext<PhoenixRepo | null>(null);

interface PhoenixSocketProviderProps {
  url: string;
  params?: object;
  children: React.ReactNode;
}

export const PhoenixSocketProvider: React.FC<PhoenixSocketProviderProps> = ({
  url,
  params,
  children,
}) => {
  const phoenix = useMemo(() => {
    return new PhoenixRepo(url, params);
  }, [url, params]);

  useEffect(() => {
    phoenix.connect();

    return () => {
      phoenix.disconnect();
    };
  }, [phoenix]);

  return (
    <PhoenixSocketContext.Provider value={phoenix}>
      {children}
    </PhoenixSocketContext.Provider>
  );
};

export const usePhoenixSocket = () => useContext(PhoenixSocketContext)!;
