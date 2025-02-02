import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartContextType {
  cartCount: number;
  wishlistCount: number;
  updateCart: (count: number) => void;
  updateWishlist: (count: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateCart = (count: number) => setCartCount(count);
  const updateWishlist = (count: number) => setWishlistCount(count);

  return (
    <CartContext.Provider value={{ cartCount, wishlistCount, updateCart, updateWishlist }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};