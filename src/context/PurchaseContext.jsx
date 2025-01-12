import React, { createContext, useState, useContext } from 'react';

const PurchaseContext = createContext();

export const PurchaseProvider = ({ children }) => {
  const [purchaseData, setPurchaseData] = useState(null);

  return (
    <PurchaseContext.Provider value={{ purchaseData, setPurchaseData }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => useContext(PurchaseContext);

