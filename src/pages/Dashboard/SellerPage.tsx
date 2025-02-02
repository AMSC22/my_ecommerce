import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";
import Card from "../../components/Card.tsx";
import LineChart from "../../components/LineChart.tsx";
import AffiliationPage from "../AffiliationPage.tsx";

const SellerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalSales: 0,
    totalProducts: 0,
    pendingOrders: 0,
    returns: 0,
    totalReviews: 0,
    affiliation: 0,
  });

  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    // Simuler un fetch des données pour le tableau de bord
    const fetchDashboardData = async () => {
      const mockData = {
        totalSales: 5200,
        totalProducts: 45,
        pendingOrders: 8,
        returns: 3,
        totalReviews: 120,
        affiliation: 10,
      };

      const mockSales = [
        {
          id: 1,
          productName: "Smartphone XYZ",
          date: "2025-01-10",
          buyer: "Jean Dupont",
          price: "699.99 €",
        },
        {
          id: 2,
          productName: "Casque Bluetooth ABC",
          date: "2025-01-09",
          buyer: "Alice Martin",
          price: "59.99 €",
        },
      ];

      const mockSalesData = [50, 60, 70, 100, 150, 200, 250, 300];

      const mockNotifications = [
        "Nouvelle commande reçue : Smartphone XYZ.",
        "Avis reçu : 5 étoiles pour le Casque Bluetooth ABC.",
      ];

      setDashboardData(mockData);
      setRecentSales(mockSales);
      setSalesData(mockSalesData);
      setNotifications(mockNotifications);
    };

    fetchDashboardData();
  }, []);

  const handleFilter = () => {
    console.log("Filtrer par date :", dateRange);
    // Implémenter un appel d'API pour filtrer les données par date
  };

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
        <div className="flex gap-4">
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
          title="Ventes totales"
          description={`${dashboardData.totalSales.toFixed(2)} €`}
          className="bg-green-100 text-green-700"
        />
        <Card
          title="Produits actifs"
          description={`${dashboardData.totalProducts} produits`}
          link="/seller-products"
          className="bg-blue-100 text-blue-700"
        />
        <Card
          title="Commandes en attente"
          description={`${dashboardData.pendingOrders} commandes`}
          link="/seller-orders"
          className="bg-yellow-100 text-yellow-700"
        />
        <Card
          title="Retours en cours"
          description={`${dashboardData.returns} retours`}
          link="/return-management"
          className="bg-red-100 text-red-700"
        />
        <Card
          title="Avis totaux"
          description={`${dashboardData.totalReviews} avis`}
          link="/seller-reviews"
          className="bg-gray-100 text-gray-700"
        />
        <Card
          title="Affiliations"
          description={`${dashboardData.affiliation} Affiliations`}
          link="/affiliations"
          className="bg-gray-100 text-gray-700"
        />
      </section>

      {/* Ventes récentes */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Ventes récentes</h2>
        <div className="bg-gray-50 p-4 rounded-md shadow-md">
          {recentSales.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2 font-semibold">Produit</th>
                  <th className="border-b p-2 font-semibold">Date</th>
                  <th className="border-b p-2 font-semibold">Acheteur</th>
                  <th className="border-b p-2 font-semibold">Prix</th>
                  <th className="border-b p-2 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale) => (
                  <tr key={sale.id}>
                    <td className="border-b p-2">{sale.productName}</td>
                    <td className="border-b p-2">{sale.date}</td>
                    <td className="border-b p-2">{sale.buyer}</td>
                    <td className="border-b p-2">{sale.price}</td>
                    <td className="border-b p-2">
                      <Button
                        label="Détails"
                        onClick={() =>
                          navigate("/sales-history", { state: { saleId: sale.id } })
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
      <footer className="flex justify-center space-x-4">
        <Button
          label="Ajouter un produit"
          onClick={() => navigate("/post-product")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        />
        <Button
          label="Voir son Abonnement"
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