import React, { useState, useEffect } from "react";
import Button from "../../components/Button.tsx";
import Tooltip from "../../components/TooltipProps.tsx";

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  status: "validé" | "en attente";
  image: string;
  variations: Variation[];
  performance: Performance;
}

interface Variation {
  id: number;
  color: string;
  size: string;
  stock: number;
}

interface Performance {
  sales: number;
  views: number;
  rating: number;
}

const SellerProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newVariation, setNewVariation] = useState<Variation>({
    id: 0,
    color: "",
    size: "",
    stock: 0,
  });

  // Simulation de l'appel API pour récupérer les produits
  useEffect(() => {
    const fetchProducts = async () => {
      const mockData: Product[] = [
        {
          id: 1,
          name: "T-shirt Homme",
          price: 20.99,
          quantity: 50,
          status: "validé",
          image: "https://via.placeholder.com/150",
          variations: [
            { id: 1, color: "Rouge", size: "M", stock: 10 },
            { id: 2, color: "Bleu", size: "L", stock: 5 },
          ],
          performance: { sales: 150, views: 300, rating: 4.5 },
        },
        {
          id: 2,
          name: "Chaussures de sport",
          price: 79.99,
          quantity: 30,
          status: "en attente",
          image: "https://via.placeholder.com/150",
          variations: [],
          performance: { sales: 80, views: 200, rating: 4.0 },
        },
      ];
      setProducts(mockData);
    };

    fetchProducts();
  }, []);

  const handleAddVariation = (productId: number) => {
    if (!newVariation.color || !newVariation.size || newVariation.stock <= 0) {
      setMessage("Veuillez remplir tous les champs de variation.");
      return;
    }

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              variations: [
                ...product.variations,
                { ...newVariation, id: product.variations.length + 1 },
              ],
            }
          : product
      )
    );
    setMessage("Variation ajoutée avec succès.");
    setNewVariation({ id: 0, color: "", size: "", stock: 0 });
  };

  const handleDeleteVariation = (productId: number, variationId: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              variations: product.variations.filter((variation) => variation.id !== variationId),
            }
          : product
      )
    );
    setMessage("Variation supprimée avec succès.");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md overflow-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Mes produits</h1>
        <p className="text-gray-600 text-center">
          Consultez et gérez vos produits, variations et performances.
        </p>
      </header>

      {message && <p className="text-center text-green-500 mb-4">{message}</p>}

      {products.length === 0 ? (
        <p className="text-center text-gray-500">Vous n'avez pas encore de produits en vente.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Image</th>
              <th className="border border-gray-300 p-2">Nom</th>
              <th className="border border-gray-300 p-2">Prix</th>
              <th className="border border-gray-300 p-2">Quantité</th>
              <th className="border border-gray-300 p-2">Statut</th>
              <th className="border border-gray-300 p-2">Performances</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="text-center">
                <td className="border border-gray-300 p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md mx-auto"
                  />
                </td>
                <td className="border border-gray-300 p-2">{product.name}</td>
                <td className="border border-gray-300 p-2">{product.price.toFixed(2)} €</td>
                <td className="border border-gray-300 p-2">{product.quantity}</td>
                <td className="border border-gray-300 p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white ${
                      product.status === "validé" ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="text-sm">
                    <p>Ventes : {product.performance.sales}</p>
                    <p>Vues : {product.performance.views}</p>
                    <p>Note : {product.performance.rating} ★</p>
                  </div>
                </td>
                <td className="border border-gray-300 p-2">
                  <div className="flex justify-center gap-2">
                    <Tooltip message="Gérer les variations">
                      <Button
                        label="Variations"
                        onClick={() => setSelectedProduct(product)}
                        className="bg-purple-500 text-white px-4 py-2 rounded-md"
                      />
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedProduct && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">
            Variations pour {selectedProduct.name}
          </h2>
          <ul className="list-disc list-inside mb-4">
            {selectedProduct.variations.map((variation) => (
              <li key={variation.id} className="flex justify-between">
                <span>
                  Couleur : {variation.color}, Taille : {variation.size}, Stock :{" "}
                  {variation.stock}
                </span>
                <Button
                  label="Supprimer"
                  onClick={() => handleDeleteVariation(selectedProduct.id, variation.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                />
              </li>
            ))}
          </ul>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Couleur"
              value={newVariation.color}
              onChange={(e) => setNewVariation({ ...newVariation, color: e.target.value })}
              className="border rounded-md p-2 flex-1"
            />
            <input
              type="text"
              placeholder="Taille"
              value={newVariation.size}
              onChange={(e) => setNewVariation({ ...newVariation, size: e.target.value })}
              className="border rounded-md p-2 flex-1"
            />
            <input
              type="number"
              placeholder="Stock"
              value={newVariation.stock}
              onChange={(e) => setNewVariation({ ...newVariation, stock: Number(e.target.value) })}
              className="border rounded-md p-2 flex-1"
            />
            <Button
              label="Ajouter"
              onClick={() => handleAddVariation(selectedProduct.id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductsPage;
