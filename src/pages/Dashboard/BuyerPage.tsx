import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";
import Card from "../../components/Card.tsx";
import LineChart from "../../components/LineChart.tsx";
import ProductCard from "../../components/ProductCard.tsx"; // Composant pour afficher des produits
import Loader from "../../components/Loader.tsx";
import { addToWishLists, addToCarts } from "../../services/ProductService.ts";
import { fetchOrders } from "../../services/OrderService.ts";
import { OderData } from "../../entities/Orders.tsx";
import { fetchvalidatedProducts } from "../../services/ProductService.ts";
import { fetchCarts } from "../../services/CartService.ts";

const BuyerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [returns, setReturns] = useState(0);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [uniqueCat, setUniqueCat] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

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

  const imageLink = "/images/";
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
        // const totalProduct: number = await ProductCount(user_id);
        // setTotalProducts(totalProduct);
        // const returns: number = await countReturns(user_id);
        // const Products = await fetchSellerValidetedProducts([user_id]);
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
        const totalSale: OderData[] = await fetchOrders(["buyer", user_id], "");
        let price: number = 0;
        
        // Extraire les category_id
        const categoryIds = totalSale.flatMap(product => product.category_ids);

        // Supprimer les doublons avec Set
        const uniqueCategoryIds: any[] = [...new Set(categoryIds)];
        setUniqueCat(uniqueCategoryIds);
        
        for (let index = 0; index < totalSale.length; index++) {
          price++;
        }
        setTotalOrders(price);
        setRecentOrders(totalSale);
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

    const fetchDashboardData = async () => {
      const mockData = {
        orders: totalOrders,
        returns: 2,
        favorites: 8,
        messages: 5,
        Affiliations: 10,
      };

      const mockOrderHistoryData = [10, 20, 15, 30, 50, 60, 70, 90];

      setDashboardData(mockData);
      setOrderHistoryData(mockOrderHistoryData);
    };

    fetchDashboardData();
  }, [user_id]);

  useEffect(() => {
    const loadRecommandedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Collecte les produits du panier de l'acheteur
        const cartId = await fetchCarts(user_id);
        const productIds = cartId.flatMap(product => product.product_id);
        const UniqueCat = [...uniqueCat, ...productIds];
        const productPromises = UniqueCat.map((categoryId) => fetchvalidatedProducts(categoryId));
        const recommandedProductArray = await Promise.all(productPromises);
        // Fusionner toutes les listes de products
        setRecommendedProducts(recommandedProductArray.flat());
        setLoading(false);
        setError(null);          
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    if (uniqueCat.length > 0) loadRecommandedProducts();

  }, [uniqueCat]);


  // 📌 Filtrer les ventes par date (exemple d'implémentation)
  const handleFilter = async () => {
    try {
      setLoading(true);
      const sale: string[] = [];
      for (let index = 0; index < recentOrders.length; index++) {
        if (dateRange.start <= recentOrders[index].date.split("T")[0] && recentOrders[index].date.split("T")[0] <= dateRange.end) {
          sale[index] = recentOrders[index];
        }
      }
      setRecentOrders(sale);
      setLoading(false);
    } catch (error: any) {
      setError(error.response?.data?.detail || "Erreur de filtrage !");
    } finally {
      setLoading(false);
    }
  };

  // Pour ajouter un produit au panier
  const addToCart = (productItems) => {
    const cart = addToCarts(productItems, user_id);   // A modifier
    localStorage.setItem("cart-update", Date.now().toString());  // Mets à jour le cache
    if (cart["user_id"] === "") {
      setMessage("Vous avez déjà ajouté ce produit à votre panier");
    };
    console.log("Cart = ", cart);
  };

  // Pour ajouter un produit dans sa liste des souhaits
  const addToWishlist = (productItems) => {
    const WishList = addToWishLists(productItems, user_id);   // A modifier
    localStorage.setItem("wishlist-update", Date.now().toString());  // Mets à jour le cache
    if (WishList["user_id"] === "") {
      setMessage("Vous avez déjà ajouté ce produit à votre liste de souhaits.");
    };
    console.log("WishList = ", WishList);
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;

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
        <div className="flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
          description={`${totalOrders} commandes`}
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
        <div className="bg-gray-50 p-4 rounded-md shadow-md overflow-auto">
          {recentOrders.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="border-b p-2 font-semibold">Produit</th>
                  <th className="border-b p-2 font-semibold">Date</th>
                  <th className="border-b p-2 font-semibold">Quantité</th>
                  <th className="border-b p-2 font-semibold">Prix Unitaire</th>
                  <th className="border-b p-2 font-semibold">Prix Total</th>
                  <th className="border-b p-2 font-semibold">Statut</th>
                  <th className="border-b p-2 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="border-b p-2">{order.productName}</td>
                    <td className="border-b p-2">{order.date.split("T")[0]}</td>
                    <td className="border-b p-2">{order.quantity}</td>
                    <td className="border-b p-2">{order.price} {order.currency}</td>
                    <td className="border-b p-2">{order.price * order.quantity} {order.currency}</td>
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
                    <td className="border-b p-2">
                      <Button
                        label="Détails"
                        onClick={() =>
                          navigate("/purchase-history", { state: { orderId: order } })
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
              onAddToCart={() => addToCart(product.id)}
              onAddToWishlist={() => addToWishlist(product.id)}
              onViewDetails={() => navigate(`/products/${product.id}`, { state: { productItems: product } })}
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
