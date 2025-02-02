import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import Button from "../../components/Button.tsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const AdminStatePage: React.FC = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    revenueData: [] as { date: string; revenue: number }[],
    userGrowthData: [] as { date: string; users: number }[],
  });

  useEffect(() => {
    // Simuler la récupération des données depuis une API
    const fetchData = () => {
      const revenueData = [
        { date: "2025-01-01", revenue: 150 },
        { date: "2025-01-02", revenue: 200 },
        { date: "2025-01-03", revenue: 180 },
        { date: "2025-01-04", revenue: 220 },
        { date: "2025-01-05", revenue: 300 },
      ];

      const userGrowthData = [
        { date: "2025-01-01", users: 5 },
        { date: "2025-01-02", users: 8 },
        { date: "2025-01-03", users: 12 },
        { date: "2025-01-04", users: 15 },
        { date: "2025-01-05", users: 20 },
      ];

      setStats({
        totalRevenue: 1050,
        totalOrders: 120,
        totalUsers: 250,
        totalProducts: 50,
        revenueData,
        userGrowthData,
      });
    };

    fetchData();
  }, []);

  // Préparation des données pour les graphiques
  const revenueLabels = stats.revenueData.map((data) => data.date);
  const revenueValues = stats.revenueData.map((data) => data.revenue);

  const userGrowthLabels = stats.userGrowthData.map((data) => data.date);
  const userGrowthValues = stats.userGrowthData.map((data) => data.users);

  const lineChartData = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Chiffre d'affaires (€)",
        data: revenueValues,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: userGrowthLabels,
    datasets: [
      {
        label: "Croissance des utilisateurs",
        data: userGrowthValues,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Produits", "Utilisateurs", "Commandes"],
    datasets: [
      {
        data: [stats.totalProducts, stats.totalUsers, stats.totalOrders],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Statistiques Administrateur</h1>
      </header>

      {/* Statistiques principales */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-blue-100 p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold">Chiffre d'affaires total</h2>
          <p className="text-2xl font-semibold">{stats.totalRevenue.toFixed(2)} €</p>
        </div>
        <div className="bg-green-100 p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold">Commandes totales</h2>
          <p className="text-2xl font-semibold">{stats.totalOrders}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold">Utilisateurs inscrits</h2>
          <p className="text-2xl font-semibold">{stats.totalUsers}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold">Produits disponibles</h2>
          <p className="text-2xl font-semibold">{stats.totalProducts}</p>
        </div>
      </section>

      {/* Graphiques */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-bold mb-4">Évolution du Chiffre d'Affaires</h3>
          <Line data={lineChartData} />
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h3 className="text-lg font-bold mb-4">Croissance des Utilisateurs</h3>
          <Bar data={barChartData} />
        </div>
      </section>

      {/* Répartition */}
      <section className="bg-white p-4 rounded-md shadow-md mb-6">
        <h3 className="text-lg font-bold mb-4">Répartition des Activités</h3>
        <div className="w-1/2 mx-auto">
          <Pie data={pieChartData} />
        </div>
      </section>

      {/* Bouton d'action */}
      <footer className="flex justify-center">
        <Button
          label="Exporter les données"
          onClick={() => console.log("Export des données en cours...")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        />
      </footer>
    </div>
  );
};

export default AdminStatePage;
