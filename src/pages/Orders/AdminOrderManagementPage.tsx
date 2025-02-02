import React, { useState } from "react";
import Button from "../../components/Button.tsx";

interface Order {
  id: number;
  customerName: string;
  items: { productName: string; quantity: number; price: number }[];
  total: number;
  status: "En attente" | "En cours" | "Expédiée" | "Livrée" | "Annulé";
  orderDate: string;
}

const AdminOrderManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "Tous" | "En attente" | "En cours" | "Expédiée" | "Livrée" | "Annulé"
  >("Tous");
  const [sortField, setSortField] = useState<"id" | "customerName" | "total" | "orderDate">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      customerName: "Alice Dupont",
      items: [
        { productName: "Smartphone XYZ", quantity: 1, price: 699.99 },
        { productName: "Casque Bluetooth ABC", quantity: 2, price: 59.99 },
      ],
      total: 819.97,
      status: "En attente",
      orderDate: "2025-01-10",
    },
    {
      id: 2,
      customerName: "Jean Martin",
      items: [{ productName: "Tablette DEF", quantity: 1, price: 499.99 }],
      total: 499.99,
      status: "Livrée",
      orderDate: "2025-01-08",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(
      e.target.value as "Tous" | "En attente" | "En cours" | "Expédiée" | "Livrée" | "Annulé"
    );
  };

  const handleSort = (field: "id" | "customerName" | "total" | "orderDate") => {
    const newSortOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const handleExport = () => {
    const csvContent = [
      ["ID", "Nom du client", "Total (€)", "Statut", "Date de commande"],
      ...orders.map((order) => [
        order.id,
        order.customerName,
        order.total.toFixed(2),
        order.status,
        order.orderDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "commandes.csv";
    link.click();
  };

  const filteredAndSortedOrders = orders
  .filter(
    (order) =>
      (filterStatus === "Tous" || order.status === filterStatus) &&
      (order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toString().includes(searchQuery))
  )
  .sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    } else if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortOrder === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
    return 0; // Si les champs ne sont ni des nombres ni des chaînes (peu probable ici)
  });

  return (
    <div className="p-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Gestion des commandes</h1>
        <p className="text-gray-600">
          Recherchez, filtrez et gérez les commandes de la plateforme.
        </p>
      </header>

      {/* Barre de recherche, filtre et export */}
      <div className="flex items-center mb-6 gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Rechercher par nom ou ID de commande"
          className="border rounded-md p-2 flex-1"
        />
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className="border rounded-md p-2"
        >
          <option value="Tous">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="En cours">En cours</option>
          <option value="Expédiée">Expédiée</option>
          <option value="Livrée">Livrée</option>
          <option value="Annulé">Annulé</option>
        </select>
        <Button
          label="Exporter les commandes"
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded"
        />
      </div>

      {/* Tableau des commandes */}
      <section className="bg-white shadow-md rounded-md overflow-hidden">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("id")}>
                ID {sortField === "id" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() => handleSort("customerName")}
              >
                Nom du client {sortField === "customerName" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("total")}>
                Total (€) {sortField === "total" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border p-2">Statut</th>
              <th className="border p-2 cursor-pointer" onClick={() => handleSort("orderDate")}>
                Date de commande {sortField === "orderDate" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedOrders.length > 0 ? (
              filteredAndSortedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border p-2">{order.id}</td>
                  <td className="border p-2">{order.customerName}</td>
                  <td className="border p-2">{order.total.toFixed(2)} €</td>
                  <td className="border p-2">{order.status}</td>
                  <td className="border p-2">{order.orderDate}</td>
                  <td className="border p-2">
                    <Button
                      label="Détails"
                      onClick={() => setSelectedOrder(order)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border p-4 text-center text-gray-600">
                  Aucune commande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Modal pour afficher les détails d'une commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Détails de la commande</h2>
            <p>
              <strong>ID :</strong> {selectedOrder.id}
            </p>
            <p>
              <strong>Client :</strong> {selectedOrder.customerName}
            </p>
            <p>
              <strong>Statut :</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Date :</strong> {selectedOrder.orderDate}
            </p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Produits :</h3>
              <ul className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <li key={index} className="border p-2 rounded-md">
                    <p>
                      <strong>{item.productName}</strong>
                    </p>
                    <p>Quantité : {item.quantity}</p>
                    <p>Prix : {item.price.toFixed(2)} €</p>
                  </li>
                ))}
              </ul>
            </div>
            <Button
              label="Fermer"
              onClick={() => setSelectedOrder(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagementPage;
