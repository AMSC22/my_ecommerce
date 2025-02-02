import React, { useEffect, useState } from "react";
import Button from "../../components/Button.tsx";
import { useNavigate } from "react-router-dom";

interface Sale {
  id: number;
  date: string;
  buyer: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  total: number;
  status: string;
}

const SalesHistoryPage: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("Tous");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterProduct, setFilterProduct] = useState<string>("Tous");
  const navigate = useNavigate();

  const datas = [
    {
      id: 1,
      date: "2025-01-10",
      buyer: "John Doe",
      items: [
        { name: "Smartphone XYZ", quantity: 1, price: 699.99, image: "https://example.com/smartphone.jpg" },
        { name: "Étui pour smartphone", quantity: 2, price: 19.99, image: "https://example.com/case.jpg" },
      ],
      total: 739.97,
      status: "Livré",
    },
    {
      id: 2,
      date: "2025-01-08",
      buyer: "Jane Smith",
      items: [
        { name: "Casque Bluetooth", quantity: 1, price: 49.99, image: "https://example.com/headphone.jpg" },
      ],
      total: 49.99,
      status: "En attente",
    },
  ];

  // Fetch historique des ventes
  useEffect(() => {
    const fetchSales = async () => {
      try {
        // const response = await fetch("/api/sales");
        const data = datas; // await response.json();
        setSales(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique :", error);
        setMessage("Erreur de chargement. Veuillez réessayer plus tard.");
      }
    };

    fetchSales();
  }, []);

  // Filtrer les ventes
  const filteredSales = sales.filter((sale) => {
    const matchesStatus = filterStatus === "Tous" || sale.status === filterStatus;
    const matchesDate = !filterDate || sale.date === filterDate;
    const matchesProduct =
      filterProduct === "Tous" ||
      sale.items.some((item) => item.name.toLowerCase().includes(filterProduct.toLowerCase()));
    return matchesStatus && matchesDate && matchesProduct;
  });

  // Exporter les données des ventes
  const handleExport = () => {
    const csvContent = [
      ["ID", "Date", "Acheteur", "Produit(s)", "Total", "Statut"],
      ...filteredSales.map((sale) => [
        sale.id,
        sale.date,
        sale.buyer,
        sale.items.map((item) => `${item.name} (x${item.quantity})`).join(", "),
        `${sale.total} €`,
        sale.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sales_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Historique des ventes</h1>
      {message && <p className="text-red-500 mb-4">{message}</p>}

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
        </select>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Filtrer par produit"
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          className="border rounded-md p-2"
        />
        <Button
          label="Réinitialiser"
          onClick={() => {
            setFilterStatus("Tous");
            setFilterDate("");
            setFilterProduct("Tous");
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        />
        <Button
          label="Exporter"
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        />
      </div>

      {filteredSales.length > 0 ? (
        <div className="space-y-6">
          {filteredSales.map((sale) => (
            <div key={sale.id} className="border rounded-md p-4 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Commande #{sale.id}</h2>
                <p className="text-gray-500">{sale.date}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {sale.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      <p>
                        Quantité : {item.quantity} | Prix : {item.price} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">Total : {sale.total} €</p>
                <p
                  className={`${
                    sale.status === "Livré"
                      ? "text-green-600"
                      : "text-yellow-600"
                  } font-semibold`}
                >
                  Statut : {sale.status}
                </p>
              </div>
              <div className="text-right mt-4">
                <Button
                  label="Contacter l'acheteur"
                  onClick={() => navigate("/message")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune vente trouvée.</p>
      )}
    </div>
  );
};

export default SalesHistoryPage;
