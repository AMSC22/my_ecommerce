import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";
import Card from "../../components/Card.tsx";
import Loader from "../../components/Loader.tsx";
import BarChart from "../../components/BarChart.tsx";
import LineChart from "../../components/LineChart.tsx";
import { CategoryCount } from "../../services/CategoryService.ts";
import { ProductCount } from "../../services/ProductService.ts";
import { ReviewCount } from "../../services/ReviewService.ts";
import { UserCount } from "../../services/UserService.ts";

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalBuyers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingReturns: 0,
    totalAffiliations: 0,
  });
  const [products, setProducts] = useState<number>(0);
  const [categorys, setCategory] = useState<number>(0);
  const [review, setReview] = useState<{"total_reviews": number, "average_ratings": number}>({"total_reviews": 0, "average_ratings": 0});
  const [user, setUser] = useState<{"buyer": number, "seller": number}>({"buyer": 0, "seller": 0});
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthlySalesData, setMonthlySalesData] = useState<number[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Simulation de données et notifications en temps réel
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
          setLoading(true);
          setMessage(null);
          const Products = await ProductCount();
          setProducts(Products);
          const Categorys = await CategoryCount();
          setCategory(Categorys);
          const review = await ReviewCount();
          setReview(review);
          const users = await UserCount();
          console.log("users = ", users);
          setUser(users);
          setLoading(false);
          setMessage(null);
        } catch (error: any) {
          setMessage("Erreur de chargement des catégories.");
          // toast.error(error.message || "Une erreur est survenue.");
        } finally {
          setLoading(false);
        }
      
      const mockData = {
        totalUsers: 500,
        totalSellers: 120,
        totalBuyers: 380,
        totalOrders: 1500,
        totalRevenue: 52000,
        pendingReturns: 8,
        totalAffiliations: 230,
      };

      const mockMonthlySales = [50, 70, 100, 80, 120, 150, 200, 180, 220, 250, 300, 350];
      const mockMonthlyRevenue = [5000, 7000, 10000, 8000, 12000, 15000, 20000, 18000, 22000, 25000, 30000, 35000];

      setDashboardData(mockData);
      setMonthlySalesData(mockMonthlySales);
      setMonthlyRevenueData(mockMonthlyRevenue);

      // Simuler les notifications en temps réel
      const mockNotifications = [
        "Nouvelle commande reçue.",
        "Un avis client a été publié.",
        "Paiement réussi pour une commande.",
      ];
      setNotifications(mockNotifications);
    };

    fetchDashboardData();
  }, []);

  const handleFilter = () => {
    console.log("Filtrer par date :", dateRange);
    // Appel d'API à implémenter pour appliquer les filtres
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-md">
      {/* En-tête */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Tableau de bord - Administrateur</h1>
        <p className="text-gray-600">
          Surveillez les activités de la plateforme et prenez des décisions éclairées.
        </p>
        {message && <p className="mb-4 text-green-500">{message}</p>}
      </header>

      {/* Notifications */}
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
      <section className="mb-6 overflow-auto">
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
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Catégories de Produit"
          description={`${categorys}`}
          link="/admin-category-management"
          className="bg-blue-100 text-blue-700"
        />
        <Card
          title="Produits"
          description={`${products}`}
          link="/admin-product-management"
          className="bg-blue-100 text-blue-700"
        />
        <Card
          title="Utilisateurs totaux"
          description={`${user.seller + user.buyer}`}
          link="/admin-user-management"
          className="bg-blue-100 text-blue-700"
        />
        <Card
          title="Vendeurs"
          description={`${user.seller}`}
          // link="/admin-user-management?sellers=true"
          className="bg-green-100 text-green-700"
        />
        <Card
          title="Acheteurs"
          description={`${user.buyer}`}
          // link="/admin-user-management?buyers=true"
          className="bg-purple-100 text-purple-700"
        />
        <Card
          title="Commandes totales"
          description={`${dashboardData.totalOrders}`}
          link="/admin-order-management"
          className="bg-yellow-100 text-yellow-700"
        />
        <Card
          title="Chiffre d'affaires"
          description={`${dashboardData.totalRevenue.toLocaleString()} €`}
          className="bg-green-200 text-green-800"
        />
        <Card
          title="Retours en attente"
          description={`${dashboardData.pendingReturns}`}
          link="/return-management"
          className="bg-red-100 text-red-700"
        />
        <Card
          title="Avis totaux"
          description={`${review.total_reviews}`}
          link="/admin-review-management"
          className="bg-gray-200 text-gray-800"
        />
        <Card
          title="Affiliation"
          description={`${dashboardData.totalAffiliations}`}
          link="/admin-affiliation-management"
          className="bg-gray-200 text-gray-800"
        />
      </section>

      {/* Graphiques */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-gray-50 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-4">Ventes mensuelles</h2>
          <BarChart
            data={monthlySalesData}
            labels={["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]}
          />
        </div>
        <div className="p-4 bg-gray-50 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-4">Chiffre d'affaires mensuel</h2>
          <LineChart
            data={monthlyRevenueData}
            labels={["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"]}
          />
        </div>
      </section>

      {/* Actions rapides */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Button
            label="Historique"
            onClick={() => navigate("/admin-history")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          />
          <Button
            label="Gérer les utilisateurs"
            onClick={() => navigate("/admin-user-management")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          />
          <Button
            label="Valider les catégories"
            onClick={() => navigate("/admin-validation-category")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          />
          <Button
            label="Gérer les commandes"
            onClick={() => navigate("/admin-order-management")}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          />
          <Button
            label="Gestion des paiements"
            onClick={() => navigate("/admin-payments")}
            className="bg-purple-500 text-white px-4 py-2 rounded"
          />
          <Button
            label="Consulter les retours"
            onClick={() => navigate("/return-management")}
            className="bg-red-500 text-white px-4 py-2 rounded"
          />
          <Button
            label="Gestion des avis"
            onClick={() => navigate("/admin-review-management")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          />
          <Button
            label="Gestion des Tickets de Support"
            onClick={() => navigate("/admin-tickets")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          />
        </div>
      </section>

      {/* Bouton Retour */}
      <footer className="mt-6 text-center">
        <Button
          label="Retour à l'accueil"
          onClick={() => navigate("/")}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
        />
      </footer>
    </div>
  );
};

export default AdminDashboardPage;