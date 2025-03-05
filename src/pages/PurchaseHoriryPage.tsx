import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../components/Loader.tsx";
import { OderData } from "../entities/Orders.tsx";
import { fetchOrders } from "../services/OrderService.ts";

interface Purchase {
  id: number;
  date: string;
  name: string;
  quantity: number;
  price: number;
  currency: string;
  image: string;
  total: number;
  status: string;
}

const PurchaseHistoryPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const imageLink = "/images/";
  const user_id = localStorage.getItem("user_id") || ""; // Récupération de l'utilisateur connecté  
  // Fetch historique des achats
  useEffect(() => {
    if (!user_id) {
      setError("Utilisateur non connecté !");
      setLoading(false);
      return;
    }
    const fetchPurchases = async () => {
      try {
        if (location.state) {
          const datas = [
            {
              "id": location.state.orderId.id,
              "date": location.state.orderId.date.split("T")[0],
              "seller": location.state.orderId.seller_name,
              "name": location.state.orderId.productName,
              "quantity": location.state.orderId.quantity,
              "price": location.state.orderId.price,
              "currency": location.state.orderId.currency,
              "image": location.state.orderId.image,
              "total": location.state.orderId.price * location.state.orderId.quantity,
              "status": location.state.orderId.status
            },
          ]
          setPurchases(datas);
        } else {
          setLoading(true);
          setError(null);
          const totalSale: OderData[] = await fetchOrders(["buyer", user_id], "");
          
          const datas = totalSale.map((value) => 
            ({
              id: value.id,
              date: value.date.split("T")[0],
              seller: value.seller_name,
              name: value.productName,
              quantity: value.quantity,
              price: value.price,
              currency: value.currency,
              image: value.image,
              total: value.price * value.quantity,
              status: value.status
            }),
          )
  
          setPurchases(datas);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        setMessage("Erreur de chargement. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user_id]);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

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
                <div className="flex items-center gap-4">
                  <img
                    src={imageLink + purchase.image}
                    alt={purchase.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-bold">{purchase.name}</h3>
                    <p>
                      Quantité : {purchase.quantity} | Prix : {purchase.price} {purchase.currency}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">Total : {purchase.total} {purchase.currency}</p>
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
