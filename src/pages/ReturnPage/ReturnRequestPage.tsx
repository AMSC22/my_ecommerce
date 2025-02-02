import React, { useState } from "react";
import Button from "../../components/Button.tsx";
import Tooltip from "../../components/TooltipProps.tsx";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  purchaseDate: string;
}

const ReturnRequestPage: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: 1,
      name: "Smartphone XYZ",
      price: 699.99,
      quantity: 1,
      purchaseDate: "2025-01-01",
    },
    {
      id: 2,
      name: "Casque Bluetooth ABC",
      price: 59.99,
      quantity: 2,
      purchaseDate: "2025-01-05",
    },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || !reason) {
      setMessage("Veuillez sélectionner un produit et fournir une raison pour le retour.");
      return;
    }

    // Simuler l'envoi de la demande de retour
    console.log("Demande de retour envoyée :", {
      productId: selectedProduct,
      reason,
      additionalDetails,
    });

    setMessage("Votre demande de retour a été soumise avec succès !");
    setSelectedProduct(null);
    setReason("");
    setAdditionalDetails("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Demande de retour</h1>
        <p className="text-gray-600 text-center">
          Sélectionnez un produit pour soumettre une demande de retour.
        </p>
      </header>

      {/* Liste des produits achetés */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">Produits achetés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`border p-4 rounded-md cursor-pointer transition-all ${
                selectedProduct === product.id ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedProduct(product.id)}
            >
              <h3 className="font-bold">{product.name}</h3>
              <p>Prix : {product.price.toFixed(2)} €</p>
              <p>Quantité : {product.quantity}</p>
              <p>Date d'achat : {product.purchaseDate}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulaire de demande de retour */}
      <section>
        <h2 className="text-xl font-bold mb-4">Formulaire de demande</h2>
        {message && (
          <p className={`mb-4 ${message.includes("succès") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Raison du retour */}
          <div>
            <label className="block font-semibold mb-2">Raison du retour</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Sélectionnez une raison</option>
              <option value="Produit défectueux">Produit défectueux</option>
              <option value="Produit non conforme à la description">
                Produit non conforme à la description
              </option>
              <option value="Changement d'avis">Changement d'avis</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          {/* Détails supplémentaires */}
          <div>
            <label className="block font-semibold mb-2">Détails supplémentaires (facultatif)</label>
            <textarea
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Ajoutez des détails supplémentaires concernant votre retour."
              className="border rounded-md p-2 w-full"
            ></textarea>
          </div>

          {/* Bouton soumettre */}
          <Button label="Soumettre la demande" type="submit" onClick={() => console.log("Demande Soumise.")}/>
        </form>
      </section>
    </div>
  );
};

export default ReturnRequestPage;
