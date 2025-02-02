import React, { useState } from "react";
import Button from "../../components/Button.tsx";

interface Payment {
  id: number;
  transactionId: string;
  customerName: string;
  amount: number;
  method: "Visa" | "MasterCard" | "PayPal" | "MTN Mobile Money" | "Orange Money";
  status: "En attente" | "Réussi" | "Échoué" | "Remboursé";
  date: string;
}

const AdminPaymentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMethod, setFilterMethod] = useState<"Tous" | Payment["method"]>("Tous");
  const [filterStatus, setFilterStatus] = useState<"Tous" | Payment["status"]>("Tous");
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      transactionId: "TXN12345",
      customerName: "Alice Dupont",
      amount: 120.5,
      method: "Visa",
      status: "Réussi",
      date: "2025-01-10",
    },
    {
      id: 2,
      transactionId: "TXN67890",
      customerName: "Jean Martin",
      amount: 49.99,
      method: "PayPal",
      status: "Échoué",
      date: "2025-01-09",
    },
  ]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterMethod = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterMethod(e.target.value as "Tous" | Payment["method"]);
  };

  const handleFilterStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value as "Tous" | Payment["status"]);
  };

  const handleStatusChange = (id: number, newStatus: Payment["status"]) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id ? { ...payment, status: newStatus } : payment
      )
    );
  };

  const handleRefund = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir rembourser ce paiement ?")) {
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === id ? { ...payment, status: "Remboursé" } : payment
        )
      );
      setNotification("Remboursement effectué avec succès !");
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const downloadReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Transaction ID,Client,Montant,Méthode,Statut,Date"]
        .concat(
          filteredPayments.map(
            (p) =>
              `${p.transactionId},${p.customerName},${p.amount},${p.method},${p.status},${p.date}`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "payments_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredPayments = payments.filter(
    (payment) =>
      (filterMethod === "Tous" || payment.method === filterMethod) &&
      (filterStatus === "Tous" || payment.status === filterStatus) &&
      (payment.transactionId.includes(searchQuery) ||
        payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      {/* Notifications */}
      {notification && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {notification}
        </div>
      )}

      {/* En-tête */}
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des paiements</h1>
          <p className="text-gray-600">
            Recherchez, filtrez et gérez les paiements effectués sur la plateforme.
          </p>
        </div>
        <Button
          label="Télécharger le rapport"
          onClick={downloadReport}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        />
      </header>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Rechercher par ID ou client"
          className="border rounded-md p-2 flex-1"
        />
        <select
          value={filterMethod}
          onChange={handleFilterMethod}
          className="border rounded-md p-2"
        >
          <option value="Tous">Toutes les méthodes</option>
          <option value="Visa">Visa</option>
          <option value="MasterCard">MasterCard</option>
          <option value="PayPal">PayPal</option>
          <option value="MTN Mobile Money">MTN Mobile Money</option>
          <option value="Orange Money">Orange Money</option>
        </select>
        <select
          value={filterStatus}
          onChange={handleFilterStatus}
          className="border rounded-md p-2"
        >
          <option value="Tous">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Réussi">Réussi</option>
          <option value="Échoué">Échoué</option>
          <option value="Remboursé">Remboursé</option>
        </select>
      </div>

      {/* Tableau des paiements */}
      <section className="bg-white shadow-md rounded-md overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Transaction ID</th>
              <th className="border p-2">Client</th>
              <th className="border p-2">Montant</th>
              <th className="border p-2">Méthode</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="border p-2">{payment.transactionId}</td>
                  <td className="border p-2">{payment.customerName}</td>
                  <td className="border p-2">{payment.amount.toFixed(2)} €</td>
                  <td className="border p-2">{payment.method}</td>
                  <td className="border p-2">
                    <select
                      value={payment.status}
                      onChange={(e) =>
                        handleStatusChange(payment.id, e.target.value as Payment["status"])
                      }
                      className="border rounded-md p-1"
                    >
                      <option value="En attente">En attente</option>
                      <option value="Réussi">Réussi</option>
                      <option value="Échoué">Échoué</option>
                      <option value="Remboursé">Remboursé</option>
                    </select>
                  </td>
                  <td className="border p-2">{payment.date}</td>
                  <td className="border p-2 flex gap-2">
                  {payment.status === "Réussi" && (
                    <Button
                      label="Rembourser"
                      onClick={() => handleRefund(payment.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                    />)}
                    <Button
                      label="Détails"
                      onClick={() => setSelectedPayment(payment)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="border p-4 text-center text-gray-600">
                  Aucun paiement trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Modal pour afficher les détails d'un paiement */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Détails du paiement</h2>
            <p><strong>Transaction ID :</strong> {selectedPayment.transactionId}</p>
            <p><strong>Client :</strong> {selectedPayment.customerName}</p>
            <p><strong>Montant :</strong> {selectedPayment.amount.toFixed(2)} €</p>
            <p><strong>Méthode :</strong> {selectedPayment.method}</p>
            <p><strong>Statut :</strong> {selectedPayment.status}</p>
            <p><strong>Date :</strong> {selectedPayment.date}</p>
            <Button
              label="Fermer"
              onClick={() => setSelectedPayment(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPaymentsPage;
