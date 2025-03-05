import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader.tsx";
import Button from "../../components/Button.tsx";
import Tooltip from "../../components/TooltipProps.tsx";
import CommandProcess from "../../components/CommandProcess.tsx";
import { fetchCarts, updateCart, removeCartItem } from "../../services/CartService.ts";
import { Carts } from "../../entities/Carts.tsx";
import ErrorComponent from "../../components/ErrorComponent.tsx";

const CartPage: React.FC = () => {
  const navigate = useNavigate(); // Navigation entre pages
  const [promoCode, setPromoCode] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<Carts[]>([]);
  const [currency, setCurrency] = useState<string>();

  // 🔹 Vérification que `user_id` est bien récupéré
  const user_id = localStorage.getItem("user_id") || "";
  if (!user_id) {
    console.warn("⚠️ Avertissement: Aucun `user_id` trouvé dans localStorage.");
  }

  console.log("user_id = ", user_id);
  // 🛒 Chargement des données du Panier
  useEffect(() => {
    const loadCarts = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔹 Vérification que `fetchCarts` retourne bien des données
        const allCarts: Carts[] = await fetchCarts(user_id);
        console.log("Carts = ", allCarts);
        if (!allCarts || allCarts.length === 0) {
          setCart([]);
          setLoading(false);
          // return;
          // throw new Error("Votre panier est vide.");
        }

        setCart(allCarts);
        setCurrency(allCarts[0]?.currency || "XAF"); // Assure une valeur par défaut
      } catch (error: any) {
        setError(error.response?.data?.detail || error.message || "Une erreur est survenue.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    loadCarts();
  }, [user_id]);

  // 🏷️ Fonction pour la mise à jour de la quantité dans l'état local
  const handleQuantityChange = (product_id: string, newQuantity: number) => {
    if (!cart) return;
    const updatedItem = cart.map((item) => item.product_id === product_id ? { ...item, quantity: newQuantity } : item);
    setCart(updatedItem);
  };

  // 🗑️ Suppression d'un article du panier
  const handleRemoveItem = async (product_id: string) => {
    if (!cart) return;
    try {
      await removeCartItem(user_id, product_id);
      setCart(cart.filter(item => item.product_id !== product_id));
    } catch (error) {
      console.error("Erreur suppression panier:", error);
      setError("Erreur lors de la suppression du produit.");
    }
  };

  // 🚚 Passer à la page Livraison
  const handleDelivery = async () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    if (!cart) return;

    try {
      await updateCart(user_id, cart);
      navigate("/delivery", { state: { cartItems: cart } });
    } catch (error) {
      console.error("Erreur mise à jour panier:", error);
      setError("Échec de la mise à jour du panier.");
    }
  };

  // Fonction pour continuer les achats
  const continueShopping = () => {
    navigate("/categories");
  };

  // 💰 Calcul des totaux
  const subTotal = cart.reduce((total, item) => total + (item.price_per_unit * item.quantity), 0);
  const taxes = subTotal * 0.2;
  const deliveryFee = subTotal > 100 ? 0 : 5;
  const total = subTotal + taxes + deliveryFee;

  // 🔄 Affichage du Loader si en cours de chargement
  if (loading) return <Loader />;

  return (
    <div className="p-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Votre panier</h1>
        <CommandProcess step={currentStep} />
      </header>

      {/* 🔴 Gestion des erreurs */}
      {error ? (
        <ErrorComponent message={error} onRetry={() => window.location.reload()} />
      ) : (
        /* Articles du panier */
      <section className="mb-6">
        {cart.length === 0 ? (
        <div className="text-center">
          
          <p className="text-lg text-gray-600 mb-6">
            Votre panier est vide.
          </p>
          <Link
            to="/categories"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Parcourir les produits
          </Link>
      
        </div>
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