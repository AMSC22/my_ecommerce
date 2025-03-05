import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader.tsx";
import Button from "../../components/Button.tsx";
import Card from "../../components/Card.tsx";
import LineChart from "../../components/LineChart.tsx";
import { ProductCount } from "../../services/ProductService.ts";
import { OrderCount } from "../../services/OrderService.ts";
import { sellerReviewCount } from "../../services/ReviewService.ts";
import { fetchSellerValidetedProducts } from "../../services/ProductService.ts";
import { fetchOrders } from "../../services/OrderService.ts";
import { OderData } from "../../entities/Orders.tsx";

const SellerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    // 📌 États pour stocker les données du backend
  const [totalSales, setTotalSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [returns, setReturns] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [affiliation, setAffiliation] = useState(0);
  
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const user_id = localStorage.getItem("user_id") || ""; // Récupération de l'utilisateur connecté
  useEffect(() => {
    if (!user_id) {
      setError("Utilisateur non connecté !");
      setLoading(false);
      return;
    }

    const loadTotal = async () => {
      try {
        setLoading(true);
        setError(null);
        const totalProduct: number = await ProductCount(user_id);
        setTotalProducts(totalProduct);
        const pendingOrder: number = await OrderCount([user_id], "pending");
        setPendingOrders(pendingOrder);
        // const returns: number = await countReturns(user_id);
        const Products = await fetchSellerValidetedProducts([user_id]);
        const totalReview: number = await sellerReviewCount(Products);
        setTotalReviews(totalReview);
        // const affiliation: number = await countAffiliation(user_id);
        setLoading(false);
        setError(null);          
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    loadTotal();

    const loadSales = async () => {
      try {
        setLoading(true);
        setError(null);
        const totalSale: OderData[] = await fetchOrders(["seller", user_id], "paid");
        let price: number = 0;
        for (let index = 0; index < totalSale.length; index++) {
          price += totalSale[index].price * totalSale[index].quantity;
        }
        setTotalSales(price);
        setRecentSales(totalSale);
        setLoading(false);
        setError(null);          
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    loadSales();

    const mockSalesData = [50, 60, 70, 100, 150, 200, 250, 300];

    const mockNotifications = [
      "Nouvelle commande reçue : Smartphone XYZ.",
      "Avis reçu : 5 étoiles pour le Casque Bluetooth ABC.",
    ];

    setSalesData(mockSalesData);
    setNotifications(mockNotifications);
  }, [user_id]);

  // 📌 Filtrer les ventes par date (exemple d'implémentation)
  const handleFilter = async () => {
    try {
      setLoading(true);
      const sale: string[] = [];
      for (let index = 0; index < recentSales.length; index++) {
        if (dateRange.start <= recentSales[index].date.split("T")[0] && recentSales[index].date.split("T")[0] <= dateRange.end) {
          sale[index] = recentSales[index];
        }
      }
      setRecentSales(sale);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.detail || "Erreur de filtrage !");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Tableau de bord - Vendeur</h1>
        <p className="text-gray-600">
          Consultez vos statistiques et gérez vos produits et ventes.
        </p>
      </header>

      {/* Notifications en temps réel */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">Notifications en temps réel</h2>
        <ul className="bg-gray-100 p-4 rounded-md shadow-md space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notif, index) => (
              <li key={index} className="text-gray-700">
                - {notif}
              </li>
            ))
          ) : (
            <p className="text-gray-500">Aucune notification pour le moment.</p>
          )}
        </ul>
      </section>

      {/* Filtres */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Filtres</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <input
            type="date"
            className="border rounded p-2"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <input
            type="date"
            className="border rounded p-2"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
          <Button label="Appliquer" onClick={handleFilter} className="bg-blue-500 text-white px-4 py-2 rounded" />
        </div>
      </section>

      {/* Statistiques principales */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card
          title="Mes Ventes totales"
          description={`${totalSales.toFixed(2)} €`}
          className="bg-green-100 text-green-700"
        />
        <Card
          title="Mes Produits"
          description={`${totalProducts} produits`}
          link="/seller-products"
          className="bg-blue-100 text-blue-700"
        />
        <Card
          title="Commandes en attente"
          description={`${pendingOrders} commandes`}
          link="/seller-orders"
          className="bg-yellow-100 text-yellow-700"
        />
        <Card
          title="Retours en cours"
          description={`${returns} retours`}
          link="/return-management"
          className="bg-red-100 text-red-700"
        />
        <Card
          title="Avis totaux"
          description={`${totalReviews} avis`}
          link="/seller-reviews"
          className="bg-gray-100 text-gray-700"
        />
        <Card
          title="Affiliations"
          description={`${affiliation} Affiliations`}
          link="/affiliation"
          className="bg-gray-100 text-gray-700"
        />
      </section>

      {/* Ventes récentes */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Ventes récentes</h2>
        <div className="bg-gray-50 p-4 rounded-md shadow-md overflow-auto">
          {recentSales.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2 font-semibold">Produit</th>
                  <th className="border-b p-2 font-semibold">Date</th>
                  <th className="border-b p-2 font-semibold">Acheteur</th>
                  <th className="border-b p-2 font-semibold">Prix Unitaire</th>
                  <th className="border-b p-2 font-semibold">Quantité</th>
                  <th className="border-b p-2 font-semibold">Prix Total</th>
                  <th className="border-b p-2 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="border-b p-2">{sale.productName}</td>
                    <td className="border-b p-2">{sale.date.split("T")[0]}</td>
                    <td className="border-b p-2">{sale.buyer}</td>
                    <td className="border-b p-2">{sale.price} {sale.price}</td>
                    <td className="border-b p-2">{sale.quantity}</td>
                    <td className="border-b p-2">{sale.quantity * sale.price}</td>
                    <td className="border-b p-2">
                      <Button
                        label="Détails"
                        onClick={() =>
                          navigate("/sales-history", { state: { saleId: sale } })
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">Aucune vente récente.</p>
          )}
        </div>
      </section>

      {/* Graphiques */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Évolution des ventes</h2>
        <LineChart data={salesData} labels={["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août"]} />
      </section>

      {/* Actions */}
      <footer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Button
          label="Ajouter un produit"
          onClick={() => navigate("/post-product")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        />
        <Button
          label="Voir mon Abonnement"
          onClick={() => navigate("/subscriptions")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        />
        <Button
          label="Voir l'historique complet"
          onClick={() => navigate("/sales-history")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        />
        <Button
          label="Retour à l'accueil"
          onClick={() => navigate("/")}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
        />
      </footer>
    </div>
  );
};

export default SellerDashboardPage;