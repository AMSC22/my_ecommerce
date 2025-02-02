import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Ajout de la navigation
import { Line, Bar } from "react-chartjs-2"; // Ajout des graphiques
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import Button from "../../components/Button.tsx";
import Tooltip from "../../components/TooltipProps.tsx";

// Enregistrement des modules de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface Transaction {
  id: number;
  type: "Achat" | "Vente";
  user: string;
  product: string;
  amount: number;
  date: string;
  status: "Livré" | "En attente" | "Annulé" | "Échoué";
  paymentMethod: "Carte" | "Paypal" | "Virement" | "Espèces";
}

const AdminHistoryPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"Aujourd'hui" | "Cette semaine" | "Ce mois" | "Tous">("Tous");
  const [filterStatus, setFilterStatus] = useState<string>("Tous");
  const [filterType, setFilterType] = useState<string>("Tous");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>("Tous");
  const [alert, setAlert] = useState<string | null>(null);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProductsSold: 0,
  });
  
  // Simuler les données de transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      const data: Transaction[] = [
        {
          id: 1,
          type: "Achat",
          user: "John Doe",
          product: "Smartphone XYZ",
          amount: 699.99,
          date: "2025-01-10",
          status: "Livré",
          paymentMethod: "Carte",
        },
        {
          id: 2,
          type: "Vente",
          user: "Jane Smith",
          product: "Casque Bluetooth",
          amount: 49.99,
          date: "2025-01-09",
          status: "En attente",
          paymentMethod: "Paypal",
        },
        {
          id: 3,
          type: "Achat",
          user: "Michael Lee",
          product: "Jeans Slim",
          amount: 39.99,
          date: "2025-01-08",
          status: "Annulé",
          paymentMethod: "Virement",
        },
      ];

      setTransactions(data);

      // Calcul des statistiques
      const revenue = data.reduce((total, item) => total + (item.status === "Échoué" ? 0 : item.amount), 0);
      const orders = data.filter((item) => item.status !== "Échoué").length;
      const productsSold = data.filter((item) => item.type === "Vente" && item.status !== "Échoué").length;

      setStats({
        totalRevenue: revenue,
        totalOrders: orders,
        totalProductsSold: productsSold,
      });
    };

    fetchTransactions();
  }, []);

  // Filtrer les transactions par période
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus = filterStatus === "Tous" || transaction.status === filterStatus;
    const matchesType = filterType === "Tous" || transaction.type === filterType;
    const matchesPaymentMethod = filterPaymentMethod === "Tous" || transaction.paymentMethod === filterPaymentMethod;
    const today = new Date();
    const transactionDate = new Date(transaction.date);

    if (filter === "Aujourd'hui") {
      return transactionDate.toDateString() === today.toDateString() && matchesStatus && matchesType && matchesPaymentMethod;
    }
    if (filter === "Cette semaine") {
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      return transactionDate >= startOfWeek && matchesStatus && matchesType && matchesPaymentMethod;
    }
    if (filter === "Ce mois") {
      return transactionDate.getMonth() === today.getMonth() && transactionDate.getFullYear() === today.getFullYear() && matchesStatus && matchesType && matchesPaymentMethod;
    }
    return matchesStatus && matchesType && matchesPaymentMethod;
  });

  // Préparation des données pour les graphiques
  const graphLabels = filteredTransactions.map((transaction) => transaction.date);
  const graphData = filteredTransactions.map((transaction) => transaction.amount);

  const lineChartData = {
    labels: graphLabels,
    datasets: [
      {
        label: "Chiffre d'affaires (€)",
        data: graphData,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: graphLabels,
    datasets: [
      {
        label: "Chiffre d'affaires (€)",
        data: graphData,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Historique Administrateur</h1>
        <div className="flex items-center gap-4 mt-4">
          <Button label="Aujourd'hui" onClick={() => setFilter("Aujourd'hui")} />
          <Button label="Cette semaine" onClick={() => setFilter("Cette semaine")} />
          <Button label="Ce mois" onClick={() => setFilter("Ce mois")} />
          <Button label="Tous" onClick={() => setFilter("Tous")} />
        </div>
      </header>

      {alert && <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">{alert}</div>}
      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="Tous">Tous les statuts</option>
          <option value="Livré">Livré</option>
          <option value="En attente">En attente</option>
          <option value="Annulé">Annulé</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="Tous">Tous les types</option>
          <option value="Achat">Achat</option>
          <option value="Vente">Vente</option>
        </select>
        <select
          value={filterPaymentMethod}
          onChange={(e) => setFilterPaymentMethod(e.target.value)}
          className="border rounded-md p-2"
        >
          <option value="Tous">Toutes les méthodes de paiement</option>
          <option value="Carte">Carte</option>
          <option value="Paypal">Paypal</option>
          <option value="Virement">Virement</option>
          <option value="Espèces">Espèces</option>
        </select>
        <Button
          label="Réinitialiser"
          onClick={() => {
            setFilter("Tous");
            setFilterStatus("Tous");
            setFilterType("Tous");
            setFilterPaymentMethod("Tous");
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        />
      </div>

      {/* Statistiques */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-100 p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold">Chiffre d'affaires total</h2>
          <p className="text-2xl font-semibold">{stats.totalRevenue.toFixed(2)} €</p>
        </div>
        <div className="bg-green-100 p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold">Commandes totales</h2>
          <p className="text-2xl font-semibold">{stats.totalOrders}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold">Produits vendus</h2>
          <p className="text-2xl font-semibold">{stats.totalProductsSold}</p>
        </div>
      </section>

      {/* Graphiques */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">Analyse du Chiffre d'Affaires</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold mb-4">Graphique Linéaire</h3>
            <Line data={lineChartData} />
          </div>
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-semibold mb-4">Histogramme</h3>
            <Bar data={barChartData} />
          </div>
        </div>
      </section>

      {/* Transactions */}
      <section>
        <h2 className="text-xl font-bold mb-4">Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Utilisateur</th>
                <th className="py-2 px-4 text-left">Produit</th>
                <th className="py-2 px-4 text-left">Montant</th>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Statut</th>
                <th className="py-2 px-4">Paiement</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-t">
                  <td className="py-2 px-4">{transaction.id}</td>
                  <td className="py-2 px-4">{transaction.type}</td>
                  <td className="py-2 px-4"><Link to={`/admin-user-profile/1/`}>{transaction.user}</Link></td>
                  <td className="py-2 px-4"><Link to={`/products/1`}> {transaction.product}</Link></td>
                  <td className="py-2 px-4">{transaction.amount.toFixed(2)} €</td>
                  <td className="py-2 px-4">{transaction.date}</td>
                  <td className="py-2 px-4">
                    <Tooltip message={`Statut: ${transaction.status}`}>
                      <span
                        className={`py-1 px-3 rounded-full text-sm ${
                          transaction.status === "Livré"
                            ? "bg-green-200 text-green-800"
                            : transaction.status === "En attente"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="py-2 px-4">{transaction.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Bouton Retour */}
      <div className="py-4 "><Button label="Retour au tableau de bord" onClick={() => navigate("/")} /></div>
      </section>
    </div>
  );
};

export default AdminHistoryPage;
