import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader.tsx";
import Button from "../../components/Button.tsx";
import Tooltip from "../../components/TooltipProps.tsx";
import CommandProcess from "../../components/CommandProcess.tsx";
import { fetchCarts, updateCart, removeCartItem } from "../../services/CartService.ts";
import { Carts } from "../../entities/Carts.tsx";
import NoElementComponent from "../../components/NoElementComponent.tsx";
import ErrorComponent from "../../components/ErrorComponent.tsx";

const CartPage: React.FC = () => {
  const navigate = useNavigate(); // Navigation entre pages
  const [promoCode, setPromoCode] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Carts[]>([]);
  const [currency, setCurrency] = useState<string>();

  const user_id = "6796bc4f387b9c8670791537"
  // Chargement des données du Panier
  useEffect(() => {
    const loadCarts = async () => {
      try {
        setLoading(true);
        setError(null);
        const allCarts: Carts[] = await fetchCarts(user_id);
        setCart(allCarts);
        setCurrency(allCarts[0].currency);
        setLoading(false);
        setError(null);          
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    loadCarts();
  }, []);

  // Fonction pour la mise à jour de la quantité dans l'état local
  const handleQuantityChange = (product_id: string, newQuantity: number) => {
    if (!cart) return;
    const updatedItem = cart.map((item) => item.product_id === product_id ? { ...item, quantity: newQuantity } : item);
    setCart(updatedItem);
  };

  // Fonction pour supprimer un article dans le panier
  const handleRemoveItem = async (product_id: string) => {
    if (!cart) return;
    const updatedCart = await removeCartItem(user_id, product_id);
    if (updatedCart) {
      let newCart: Carts[] = [];
      for (let index = 0; index < cart.length; index++) {
        if (product_id != cart[index].product_id) {
          // delete cart[index];
          newCart[index] = cart[index];
          break
        }
      }
      setCart(newCart);
    } else {
      setError("Erreur lors de la suppression du produit.");
    }
  };

  // Fonction pour passer à la page livraison
  const handleDelivery = async () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4)); // Met à jour le processus de commande
    if (!cart) return;
    const updatedCart = await updateCart(user_id, cart);
    if (updatedCart) {
      navigate("/delivery", { state: { cartItems: cart } }); // Transmet les produits
    } else {
      setError("Echec de la mise à jour du panier.");
    }
  };

  // Fonction pour continuer les achats
  const continueShopping = () => {
    navigate("/categories");
  };

  // Calcul des totaux
  let subTotal: number;
  if (cart.length === 0) {
    subTotal = 0;
  } else {
  subTotal = cart.reduce(
    (total: number, item: any) => total + item.price_per_unit * item.quantity,
    0
  );};
  const taxes = subTotal * 0.2; // Exemple : 20% de taxes
  const deliveryFee = subTotal > 100 ? 0 : 5; // Livraison gratuite pour les commandes > 100€
  const total = subTotal + taxes + deliveryFee;
  
  if (loading) return <Loader />;

  return (
    <div className="p-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Votre panier</h1>
        <CommandProcess step={currentStep} />
      </header>

      {/* Articles du panier */}
      {error ? (
        <ErrorComponent message={error} onRetry={() => navigate("/cart")} />
      ) : (
      <section className="mb-6">
        {cart.length === 0 ? (
          <NoElementComponent message="Vous n'avez aucun produit dans votre Panier." />
        ) : (
        cart.map((item: any) => (
          <div
            key={item.product_id}
            className="flex items-center justify-between border-b py-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-md"
            />
            <div className="flex-1 ml-4">
              <h2 className="font-bold">{item.name}</h2>
              <p>{item.price_per_unit} {item.currency}</p>
            </div>
            <div className="flex items-center gap-2 px-4">
              <Tooltip message="Cliquez ici pour diminuer la quantité">
                <Button
                  label="-"
                  onClick={() =>
                    handleQuantityChange( item.product_id, Math.max(item.quantity - 1, 1) )
                  }
                />
                <span className="px-4">{item.quantity}</span>
              </Tooltip>
              <Tooltip message="Cliquez ici pour augmenter la quantité">
                <Button
                  label="+"
                  onClick={() =>
                    handleQuantityChange( item.product_id, item.quantity + 1 )
                  }
                />
              </Tooltip>
            </div>
            <Tooltip message="Cliquez ici pour supprimer l'élément">
              <Button
                label="Supprimer"
                onClick={() => handleRemoveItem(item.product_id)}
                type="danger"
              />
            </Tooltip>
          </div>
        ))
        )}
      </section>
      )}

      {/* Résumé */}
      <section className="border p-4 rounded-md mb-6">
        <h2 className="text-lg font-bold mb-4">Résumé de la commande</h2>
        <p>Sous-total : {subTotal.toFixed(2)} {currency}</p>
        <p>Taxes (20%) : {taxes.toFixed(2)} {currency}</p>
        <p>Frais de livraison : {deliveryFee.toFixed(2)} {currency}</p>
        <h3 className="text-xl font-bold mt-4">Total : {total.toFixed(2)} {currency}</h3>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Code promo"
            className="border rounded-md p-2 w-full mb-2"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <Button label="Appliquer" onClick={() => console.log("Code promo appliqué")} />
        </div>
      </section>

      {/* Actions */}
      <footer className="flex justify-between">
        <Button
          label="Continuer vos achats"
          type="secondary"
          onClick={continueShopping}
        />
        <Button
          label="Passer à la livraison"
          onClick={handleDelivery}
        />
      </footer>
    </div>
  );
};

export default CartPage;