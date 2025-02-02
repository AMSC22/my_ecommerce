import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";
import Card from "../../components/Card.tsx";
import LineChart from "../../components/LineChart.tsx";
import ProductCard from "../../components/ProductCard.tsx"; // Composant pour afficher des produits
import AffiliationPage from "../AffiliationPage.tsx";

const BuyerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    orders: 0,
    returns: 0,
    favorites: 0,
    messages: 0,
    Affiliations: 0,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [orderHistoryData, setOrderHistoryData] = useState<number[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Simulation de données
  useEffect(() => {
    const fetchDashboardData = async () => {
      const mockData = {
        orders: 15,
        returns: 2,
        favorites: 8,
        messages: 5,
        Affiliations: 10,
      };

      const mockOrders = [
        {
          id: 1,
          productName: "Smartphone XYZ",
          date: "2025-01-10",
          status: "Livré",
          price: "699.99 €",
        },
        {
          id: 2,
          productName: "Casque Bluetooth ABC",
          date: "2025-01-09",
          status: "En attente",
          price: "59.99 €",
        },
      ];

      const mockOrderHistoryData = [10, 20, 15, 30, 50, 60, 70, 90];

      const mockRecommendedProducts = [
        {
          id: 1,
          name: "Tablette DEF",
          price: 299.99,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 2,
          name: "Écouteurs GHI",
          price: 49.99,
          image: "https://via.placeholder.com/150",
        },
      ];

      setDashboardData(mockData);
      setRecentOrders(mockOrders);
      setOrderHistoryData(mockOrderHistoryData);
      setRecommendedProducts(mockRecommendedProducts);
    };

    fetchDashboardData();
  }, []);

  const handleFilter = () => {
    console.log("Filtrer par date :", dateRange);
    // Implémenter un appel d'API pour filtrer les données par date
  };

  const handleToCart = (productId) => {
    console.log("Ajouter au panier : ", productId);
  };

  const handleToWishlist = (productId) => {
    console.log("Ajouter à la liste des souhaits : ", productId);
  };
  const handleViewDetails = (productId) => {
    console.log("Afficher les détails : ", productId);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      {/* En-tête */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Tableau de bord - Acheteur</h1>
        <p className="text-gray-600">
          Bienvenue sur votre tableau de bord. Consultez vos activités récentes
          et vos statistiques.
        </p>
      </header>

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
          <Button
            label="Appliquer"
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          />
        </div>
      </section>

      {/* Statistiques principales */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card
          title="Commandes"
          description={`${dashboardData.orders} commandes`}
          link="/purchase-history"
          onActionClick={() => navigate("/purchase-history")}
          className="bg-blue-100 text-blue-700"
        />
        <Card
          title="Retours"
          description={`${dashboardData.returns} demandes de retour`}
          link="/return-status"
          onActionClick={() => navigate("/return-status")}
          className="bg-yellow-100 text-yellow-700"
        />
        <Card
          title="Favoris"
          description={`${dashboardData.favorites} produits favoris`}
          link="/favorites"
          onActionClick={() => navigate("/favorites")}
          className="bg-red-100 text-red-700"
        />
        <Card
          title="Messages"
          description={`${dashboardData.messages} nouveaux messages`}
          link="/message"
          className="bg-green-100 text-green-700"
          onActionClick={() => navigate("/message")}
        />
        <Card
          title="Affiliations"
          description={`${dashboardData.Affiliations} Affiliations`}
          link="/affiliation"
          onActionClick={() => navigate("/affiliation")}
          className="bg-red-100 text-red-700"
        />
      </section>

      {/* Commandes récentes */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Commandes récentes</h2>
        <div className="bg-gray-50 p-4 rounded-md shadow-md">
          {recentOrders.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2 font-semibold">Produit</th>
                  <th className="border-b p-2 font-semibold">Date</th>
                  <th className="border-b p-2 font-semibold">Statut</th>
                  <th className="border-b p-2 font-semibold">Prix</th>
                  <th className="border-b p-2 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="border-b p-2">{order.productName}</td>
                    <td className="border-b p-2">{order.date}</td>
                    <td className="border-b p-2">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          order.status === "Livré"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="border-b p-2">{order.price}</td>
                    <td className="border-b p-2">
                      <Button
                        label="Détails"
                        onClick={() =>
                          navigate("/purchase-history", { state: { orderId: order.id } })
                        }
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">Aucune commande récente.</p>
          )}
        </div>
      </section>

      {/* Graphiques */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Évolution des commandes</h2>
        <LineChart
          data={orderHistoryData}
          labels={["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août"]}
        />
      </section>

      {/* Recommandations de produits */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Produits recommandés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleToCart(product.id)}
              onAddToWishlist={() => handleToWishlist(product.id)}
              onViewDetails={() => handleViewDetails}
            />
          ))}
        </div>
      </section>

      {/* Actions */}
      <footer className="flex justify-center space-x-4">
        <Button
          label="Voir l'historique complet"
          onClick={() => navigate("/purchase-history")}
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

export default BuyerDashboardPage;
