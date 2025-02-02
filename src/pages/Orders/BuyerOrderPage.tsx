import React, { useState, useEffect } from "react";

interface Order {
  id: number;
  date: string;
  status: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  currentStep: number;
  trackingSteps: string[];
}

const OrderTrackingPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Simuler l'appel API pour récupérer les commandes de l'utilisateur
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const mockOrders: Order[] = [
          {
            id: 1,
            date: "2025-01-10",
            status: "En cours",
            currentStep: 2,
            trackingSteps: ["Commandé", "En préparation", "Expédié", "Livré"],
            items: [
              {
                name: "Smartphone XYZ",
                quantity: 1,
                price: 699.99,
                image: "https://via.placeholder.com/150",
              },
            ],
          },
          {
            id: 2,
            date: "2025-01-08",
            status: "Livré",
            currentStep: 4,
            trackingSteps: ["Commandé", "En préparation", "Expédié", "Livré"],
            items: [
              {
                name: "Casque Bluetooth ABC",
                quantity: 2,
                price: 59.99,
                image: "https://via.placeholder.com/150",
              },
            ],
          },
        ];
        setOrders(mockOrders);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes :", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Suivi des commandes</h1>
        <p className="text-gray-500">Suivez vos commandes en temps réel.</p>
      </header>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Vous n'avez aucune commande.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-md p-4 shadow-md hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Commande #{order.id}</h2>
                <p className="text-gray-500">{order.date}</p>
              </div>
              <p className="text-gray-600">
                Statut :{" "}
                <span
                  className={`font-bold ${
                    order.status === "Livré"
                      ? "text-green-600"
                      : order.status === "Expédié"
                      ? "text-blue-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Détails de la commande #{selectedOrder.id}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold">Articles :</h3>
              <ul>
                {selectedOrder.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-4 mb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p>
                        Quantité : {item.quantity} | Prix : {item.price.toFixed(2)} €
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-2">Statut de suivi :</h3>
              <ul className="list-disc list-inside">
                {selectedOrder.trackingSteps.map((step, index) => (
                  <li
                    key={index}
                    className={`${
                      index + 1 === selectedOrder.currentStep
                        ? "text-blue-600 font-bold"
                        : index + 1 < selectedOrder.currentStep
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {index + 1 === selectedOrder.currentStep ? "➡️ " : ""}
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={() => setSelectedOrder(null)}
          >
            Fermer
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;