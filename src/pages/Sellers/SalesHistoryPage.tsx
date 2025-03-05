import React, { useEffect, useState } from "react";
import Button from "../../components/Button.tsx";
import Loader from "../../components/Loader.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchOrders } from "../../services/OrderService.ts";

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
  currency: string,
  buyerId: string,
  status: string;
}

const SalesHistoryPage: React.FC = () => {
  const location = useLocation(); // Récupérer les données transmises par SellerDashbord
  const [sales, setSales] = useState<Sale[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("Tous");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterProduct, setFilterProduct] = useState<string>("Tous");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const user_id = localStorage.getItem("user_id") || ""; // Récupération de l'utilisateur connecté

  // Récupérer les données transmises par la page SellerDashbord
  useEffect(() => {
    
    const fetchSales = async () => {
      if (!user_id) {
        setMessage("Utilisateur non connecté !");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const Orders = await fetchOrders([user_id]);
        const sellerData = Orders.map((value) => ({
          id: value.id,
          date: value.date.split("T")[0],
          buyer: value.buyer,
          items: [
            { name: value.productName, 
              quantity: value.quantity, 
              price: value.price, 
              image: value.image }],
          total: value.price * value.quantity,
          status: value.status,
          currency: value.currency,
          buyerId: value.buyer_id,
        }));
        setSales(sellerData);
        setLoading(false);
      } catch (error) {
        setMessage("Erreur de chargement. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    
    if (location.state && location.state.saleId) {
      const sellerData = [{
          id: location.state.saleId.id,
          date: location.state.saleId.date.split("T")[0],
          buyer: location.state.saleId.buyer,
          items: [
            { name: location.state.saleId.productName, 
              quantity: location.state.saleId.quantity, 
              price: location.state.saleId.price, 
              image: location.state.saleId.image }],
          total: location.state.saleId.price * location.state.saleId.quantity,
          status: location.state.saleId.status,
          currency: location.state.saleId.currency,
          buyerId: location.state.saleId.buyer_id,
        }]
      setSales(sellerData);
    }else{
      fetchSales();
    }

  }, [location]);

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
        `${sale.total} ${sale.currency}`,
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

  if (loading) return <Loader />;
  
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
                        Quantité : {item.quantity} | Prix : {item.price} {sale.currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="font-semibold text-lg">Total : {sale.total} {sale.currency}</p>
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
                  onClick={() => navigate("/message", { state: { buyerId: sale.buyerId } })}
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
