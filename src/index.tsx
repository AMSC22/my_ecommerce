import React from "react";
import ReactDOM from "react-dom";
import "./pages/Langue/i18n.js";
import { CurrencyProvider } from "./contexts/CurrencyContext.tsx"
import { QueryClient, QueryClientProvider } from "react-query";
import { CartProvider } from "./contexts/CartContext.tsx";
import './index.css';
import App from "./App.tsx";

// Créez une instance de QueryClient
const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <CurrencyProvider>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
      <App />
      </CartProvider>
    </QueryClientProvider>
    </CurrencyProvider>
  </React.StrictMode>,
  document.getElementById("root")
);