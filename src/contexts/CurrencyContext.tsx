import React, { createContext, useContext, useState, ReactNode } from "react";

const CurrencyContext = createContext<any>(null);

interface CurrencyProviderProps {
  children: ReactNode;
}

export const CurrencyProvider = ({ children }: CurrencyProviderProps) => {
  const [currency, setCurrency] = useState("EUR");
  const [exchangeRates, setExchangeRates] = useState({ EUR: 1, USD: 1.2, XAF: 655 });

  const convertPrice = (price: number, currency: string) => {
    return (price * exchangeRates[currency]).toFixed(2);
  };

  const value = { currency, setCurrency, convertPrice };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);