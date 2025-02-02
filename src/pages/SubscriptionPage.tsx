import React, { useState } from "react";
import Button from "../components/Button.tsx";
import Card from "../components/Card.tsx";

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  features: string[];
  currency: string;
}

const SubscriptionPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: 1,
      name: "Plan Basic",
      price: 10,
      features: ["1 utilisateur", "Support basique", "Accès limité"],
      currency: "EUR",
    },
    {
      id: 2,
      name: "Plan Standard",
      price: 20,
      features: ["5 utilisateurs", "Support prioritaire", "Accès illimité"],
      currency: "EUR",
    },
    {
      id: 3,
      name: "Plan Premium",
      price: 50,
      features: ["Utilisateurs illimités", "Support dédié", "Analyses avancées"],
      currency: "EUR",
    },
  ]);

  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubscribe = () => {
    if (!selectedPlan) {
      setMessage("Veuillez sélectionner un plan pour continuer.");
      return;
    }

    const plan = plans.find((p) => p.id === selectedPlan);
    if (plan) {
      setMessage(`Vous avez choisi le ${plan.name} pour ${plan.price} ${plan.currency}.`);
      // Intégration de l'API pour gérer l'abonnement ici
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Abonnement</h1>
        {message && <p className="text-center text-green-500 mt-4">{message}</p>}
      </header>

      {/* Liste des plans */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            title={plan.name}
            description={`Prix : ${plan.price.toFixed(2)} ${plan.currency}`}
            footer={`Caractéristiques : ${plan.features.join(", ")}`}
            onActionClick={() => setSelectedPlan(plan.id)}
            className={`cursor-pointer ${
              selectedPlan === plan.id ? "border-blue-500" : "hover:border-gray-300"
            }`}
          />
        ))}
      </section>

      {/* Bouton de confirmation */}
      <footer className="text-center mt-6">
        <Button
          label="S'abonner"
          onClick={handleSubscribe}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        />
      </footer>
    </div>
  );
};

export default SubscriptionPage;
