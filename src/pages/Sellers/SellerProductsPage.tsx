import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader.tsx";
import { fetchSellerProducts } from "../../services/ProductService.ts";
import { Product } from "../../entities/Product.tsx";
import { filterAndSortProduct } from "../../utils/ProductUtils.ts";

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   quantity: number;
//   status: "validé" | "en attente";
//   image: string;
//   variations: Variation[];
//   performance: Performance;
// }


const SellerProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const user_id = localStorage.getItem("user_id") || ""; // Récupération de l'utilisateur connecté
  
  // Simulation de l'appel API pour récupérer les produits
  useEffect(() => {
    if (!user_id) {
      setError("Utilisateur non connecté !");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const products: Product[] = await fetchSellerProducts([user_id]);
        // products.map((value) => { ...value, performance: { sales: 150, views: 300, rating: 4.5 } })
        setProducts(products.map((value) => ({...value, performance: { sales: 150, views: 300, rating: 4.5 }})));
        setLoading(false);
        setError(null);          
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
      // const mockData: Product[] = [
      //   {
      //     id: 1,
      //     name: "T-shirt Homme",
      //     price: 20.99,
      //     quantity: 50,
      //     status: "validé",
      //     image: "https://via.placeholder.com/150",
      //     variations: [
      //       { id: 1, color: "Rouge", size: "M", stock: 10 },
      //       { id: 2, color: "Bleu", size: "L", stock: 5 },
      //     ],
      //     performance: { sales: 150, views: 300, rating: 4.5 },
      //   },
      //   {
      //     id: 2,
      //     name: "Chaussures de sport",
      //     price: 79.99,
      //     quantity: 30,
      //     status: "en attente",
      //     image: "https://via.placeholder.com/150",
      //     variations: [],
      //     performance: { sales: 80, views: 200, rating: 4.0 },
      //   },
      // ];
      // setProducts(mockData);
    };

    fetchProducts();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  
  const filteredProducts = filterAndSortProduct(products, search, "", "");
  
  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Mes produits</h1>
        <p className="text-gray-600 text-center">
          Consultez et gérez vos produits, variations et performances.
        </p>
        <input
          type="text"
          placeholder="Rechercher un produit"
          className="border rounded-md p-2 w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      {message && <p className="text-center text-green-500 mb-4">{message}</p>}

      {products.length === 0 ? (
        <p className="text-center text-gray-500">Vous n'avez pas encore de produits en vente.</p>
      ) : (
        <section className=" overflow-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Nom</th>
              <th className="border border-gray-300 p-2">Prix</th>
              <th className="border border-gray-300 p-2">Quantité</th>
              <th className="border border-gray-300 p-2">Actif</th>
              <th className="border border-gray-300 p-2">Statut</th>
              <th className="border border-gray-300 p-2">Performances</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="border border-gray-300 p-2">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md mx-auto"
                  />
                </td>
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">{product.price.toFixed(2)} { product.currency }</td>
                <td className="border border-gray-300 p-2">{product.quantity}</td>
                <td className="border border-gray-300 p-2">{product.is_active ? "Actif" : "Inactif"}</td>
                <td className="border border-gray-300 p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      product.is_pending ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {product.is_pending ? "Validé" : "En attente"}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="text-sm">
                    <p>Ventes : {product.performance?.sales}</p>
                    <p>Vues : {product.performance?.views}</p>
                    <p>Note : {product.performance?.rating} ★</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </section>
      )}
    </div>
  );
};

export default SellerProductsPage;
