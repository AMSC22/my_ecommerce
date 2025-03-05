import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./pages/Langue/i18n.js";
import { CurrencyProvider } from "./contexts/CurrencyContext.tsx"
import { QueryClient, QueryClientProvider } from "react-query";
import { CartProvider } from "./contexts/CartContext.tsx";
import './index.css';
import App from "./App.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CurrencyProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <App />
        </CartProvider>
      </QueryClientProvider>
    </CurrencyProvider>
  </StrictMode>,
)
