import React, { useState } from "react";
import Button from "../../components/Button.tsx";
import CommandProcess from "../../components/CommandProcess.tsx";
import { useNavigate } from "react-router-dom";

const ConfirmationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(4);
  const navigate = useNavigate(); // Initialise la navigation
  // Exemple de données de commande
  const orderDetails = {
    orderId: "ABC12345",
    items: [
      { id: 1, name: "Smartphone XYZ", price: 699.99, quantity: 1 },
      { id: 2, name: "Casque Bluetooth ABC", price: 59.99, quantity: 2 },
    ],
    deliveryAgency: "DHL Express",
    total: 819.97,
  };

  return (
    <div className="p-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Confirmation de commande</h1>
        <CommandProcess step={currentStep}/>
        <p>Merci pour votre commande !</p>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Détails de la commande :</h2>
        <p>
          <strong>ID de commande :</strong> {orderDetails.orderId}
        </p>
        <p>
          <strong>Agence de livraison :</strong> {orderDetails.deliveryAgency}
        </p>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Produits commandés :</h3>
          <ul className="space-y-4">
            {orderDetails.items.map((item) => (
              <li key={item.id} className="border p-4 rounded-md">
                <h4 className="font-bold">{item.name}</h4>
                <p>
                  Prix : {item.price.toFixed(2)} € x {item.quantity}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Total : {orderDetails.total.toFixed(2)} €</h3>
        </div>
      </section>

      <footer className="text-center">
        <Button label="Retour à l'accueil" onClick={() => navigate("/")} />
      </footer>
    </div>
  );
};

export default ConfirmationPage;