import React from "react";
import { useCurrency } from "../contexts/CurrencyContext.tsx";

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="border rounded-md p-2"
    >
      <option value="EUR">EUR</option>
      <option value="USD">USD</option>
      <option value="XAF">XAF</option>
    </select>
  );
};

export default CurrencySelector;

