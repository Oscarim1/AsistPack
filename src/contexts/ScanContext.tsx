import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ScanContextType {
  hasScanned: boolean;
  setHasScanned: (value: boolean) => void;
}

const ScanContext = createContext<ScanContextType>({
  hasScanned: false,
  setHasScanned: () => {},
});

export const ScanProvider = ({ children }: { children: ReactNode }) => {
  const [hasScanned, setHasScanned] = useState(false);
  return (
    <ScanContext.Provider value={{ hasScanned, setHasScanned }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => useContext(ScanContext);