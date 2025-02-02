import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";
import Tooltip from "../../components/TooltipProps.tsx";
import CommandProcess from "../../components/CommandProcess.tsx";

const DeliveryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Récupérer les données transmises par la page panier
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [deliveryPrice, setDeliveryPrice] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]); // Les produits envoyés par la page panier
  const [currentStep, setCurrentStep] = useState(2);
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs

  // Liste des agences de livraison
  const deliveryAgencies = [
    { id: 1, name: "DHL Express", price: 10.0, deliveryTime: "2-3 jours" },
    { id: 2, name: "FedEx", price: 8.5, deliveryTime: "3-5 jours" },
    { id: 3, name: "UPS", price: 7.0, deliveryTime: "5-7 jours" },
  ];

  // Récupérer les données transmises par la page panier
  useEffect(() => {
    if (location.state && location.state.cartItems) {
      setCartItems(location.state.cartItems);
    }
  }, [location]);

  // Calculer les totaux
  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const taxes = subTotal * 0.2; // Exemple : 20% de taxes
  const total = subTotal + taxes + deliveryPrice;

  // Fonction pour gérer la sélection de l'agence de livraison
  const handleAgencySelect = (agency: any) => {
    setSelectedAgency(agency.name);
    setDeliveryPrice(agency.price);
    setDeliveryTime(agency.deliveryTime);
    setError(null); // Supprime l'erreur si l'utilisateur sélectionne une agence
  };

  // Fonction pour confirmer la livraison
  const handleConfirmDelivery = () => {
    if (!selectedAgency) {
      setError("Veuillez sélectionner une agence de livraison.");
      return;
    }

    // Redirection vers la page paiement avec les données transmises
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    navigate("/payment", {
      state: {
        cartItems,
        deliveryAgency: selectedAgency,
        deliveryPrice,
        deliveryTime,
        total,
      },
    });
  };

  // Fonction pour revenir au panier
  const handleReturnToCart = () => {
    navigate("/cart", { state: { cartItems } }); // Renvoie les données à la page panier
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Livraison</h1>
        <CommandProcess step={currentStep} />
      </header>

      {/* Choix de l'agence de livraison */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Choisissez une agence de livraison :</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {deliveryAgencies.map((agency) => (
            <Tooltip key={agency.id} message={`Livraison en ${agency.deliveryTime}`}>
              <div
                onClick={() => handleAgencySelect(agency)}
                className={`border p-4 rounded-md cursor-pointer transition-all ${
                  selectedAgency === agency.name ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"
                }`}
              >
                <h3 className="text-lg font-bold">{agency.name}</h3>
                <p>Prix : {agency.price.toFixed(2)} €</p>
                <p>Temps estimé : {agency.deliveryTime}</p>
              </div>
            </Tooltip>
          ))}
        </div>
        {/* Message d'erreur */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </section>

      {/* Résumé de la commande */}
      <section className="border p-4 rounded-md mb-6">
        <h2 className="text-lg font-bold mb-4">Résumé de la commande</h2>
        <div>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toFixed(2)} €</span>
              </li>
            ))}
          </ul>
          <hr className="my-4" />
          <p>Sous-total : {subTotal.toFixed(2)} €</p>
          <p>Taxes (20%) : {taxes.toFixed(2)} €</p>
          <p>Frais de livraison : {deliveryPrice.toFixed(2)} €</p>
          <h3 className="text-xl font-bold mt-4">Total : {total.toFixed(2)} €</h3>
        </div>
      </section>

      {/* Actions */}
      <footer className="flex justify-between">
        <Button
          label="Retour au panier"
          type="secondary"
          onClick={handleReturnToCart}
        />
        <Button
          label="Confirmer la livraison"
          onClick={handleConfirmDelivery}
        />
      </footer>
    </div>
  );
};

export default DeliveryPage;