import React, { useEffect, useState } from "react";

interface Order {
  id: number;
  buyer: string;
  products: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  date: string;
}

const SellerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders/seller");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6">Commandes reçues</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : orders.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Numéro de commande</th>
              <th className="border px-4 py-2">Acheteur</th>
              <th className="border px-4 py-2">Produits</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Statut</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">{order.buyer}</td>
                <td className="border px-4 py-2">
                  {order.products.map((product, index) => (
                    <div key={index}>
                      {product.name} x {product.quantity}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2">{order.total.toFixed(2)} €</td>
                <td className="border px-4 py-2">{order.status}</td>
                <td className="border px-4 py-2">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellerOrdersPage;
