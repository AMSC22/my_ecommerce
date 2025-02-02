import React, { useEffect, useState } from "react";
import Button from "../components/Button.tsx";

interface Purchase {
  id: number;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
  status: string;
}

const PurchaseHistoryPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const datas = [
    {
      "id": 1,
      "date": "2025-01-10",
      "seller": "TechShop Inc.",
      "items": [
        {
          "name": "Casque Bluetooth",
          "quantity": 1,
          "price": 49.99,
          "image": "https://example.com/headphone.jpg"
        }
      ],
      "total": 49.99,
      "status": "Livré"
    },
    {
      "id": 2,
      "date": "2025-01-08",
      "seller": "FashionWorld",
      "items": [
        {
          "name": "T-shirt en coton",
          "quantity": 2,
          "price": 15.99,
          "image": "https://example.com/tshirt.jpg"
        },
        {
          "name": "Jeans slim",
          "quantity": 1,
          "price": 39.99,
          "image": "https://example.com/jeans.jpg"
        }
      ],
      "total": 71.97,
      "status": "En attente"
    }
  ]
  
  // Fetch historique des achats
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        // const response = await fetch("/api/purchases");
        const data = datas; // await response.json();
        setPurchases(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique :", error);
        setMessage("Erreur de chargement. Veuillez réessayer plus tard.");
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Historique des achats</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}

      {purchases.length > 0 ? (
        <div className="space-y-6">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="border rounded-md p-4 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Commande #{purchase.id}</h2>
                <p className="text-gray-500">{purchase.date}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {purchase.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      <p>
                        Quantité : {item.quantity} | Prix : {item.price} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">Total : {purchase.total} €</p>
                <p
                  className={`${
                    purchase.status === "Livré"
                      ? "text-green-600"
                      : "text-yellow-600"
                  } font-semibold`}
                >
                  Statut : {purchase.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucun achat trouvé.</p>)
      }
    </div>
  );
};

export default PurchaseHistoryPage;
