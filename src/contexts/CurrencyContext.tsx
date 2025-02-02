import React, { createContext, useContext, useState } from "react";

const CurrencyContext = createContext<any>(null);

export const CurrencyProvider: React.FC = ({ children }) => {
  const [currency, setCurrency] = useState("EUR");
  const [exchangeRates, setExchangeRates] = useState({ EUR: 1, USD: 1.2, XAF: 655 });

  const convertPrice = (price: number, currency: string) => {
    return (price * exchangeRates[currency]).toFixed(2);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);