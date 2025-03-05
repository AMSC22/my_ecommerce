import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import Loader from "../components/Loader.tsx";
import Card from "../components/Card.tsx";
import Button from "../components/Button.tsx";
import { Product } from "../entities/Product.tsx";
import { fetchvalidatedProducts, fetchProductStats } from "../services/ProductService.ts";
import { filterAndSortProduct } from "../utils/ProductUtils.ts";
import NoElementComponent from "../components/NoElementComponent.tsx";
import NoResultComponent from "../components/NoResultComponent.tsx";
import ErrorComponent from "../components/ErrorComponent.tsx";

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    search: "",
    priceRange: [0, 1000],
    brand: "",
    rating: 0,
    inStock: false,
  });

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  let loadProducts: any;
  useEffect(() => {
    loadProducts = async () => {
      try {
        setError(null);
        setLoading(true);
        const allProducts = await fetchvalidatedProducts(categoryId);
        const productsWithStats = await fetchProductStats(allProducts);
        setProducts(productsWithStats);
        setLoading(false);
        setError(null);        
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }

    };
    loadProducts();
  }, []);

  const handleRetry = async () => {
    loadProducts();
  };
  // Filtrage et tri des catégories
  const filteredProducts = filterAndSortProduct(products, search, sortBy, order);

  // const data = {
  //   products: [
  //     { id: 1, name: "Smartphone XYZ", price: 699.99, rating: 4.5, color: "Noir", inStock: true, image: "https://via.placeholder.com/150" },
  //     { id: 2, name: "Casque Bluetooth ABC", price: 59.99, rating: 4.0, color: "Blanc", inStock: false, image: "https://via.placeholder.com/150" },
  //     { id: 3, name: "Robe élégante", price: 49.99, rating: 3.5, color: "Rouge", inStock: true, image: "https://via.placeholder.com/150" },
  //     { id: 4, name: "Pantalon en jean", price: 39.99, rating: 4.8, color: "Bleu", inStock: true, image: "https://via.placeholder.com/150" },
  //     { id: 5, name: "Fauteuil confortable", price: 89.99, rating: 4.2, color: "Gris", inStock: false, image: "https://via.placeholder.com/150" },
  //   ],
  // };

  // Gestion de la pagination
  const itemsPerPage = 12; // Nombre d'articles par page
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts
    .filter((product) => {
      const matchesRating = (filters.rating <= product.rating && product.rating < filters.rating + 1) || filters.rating === 0;
      const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesBrand = !filters.brand || product.name.includes(filters.brand);
      const matchesStatus = !filters.inStock || (product.status == "available");
      return matchesPrice && matchesBrand  && matchesStatus && matchesRating;
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <Loader />;
  let NoValue: any;
  if (products.length === 0) {
    NoValue = <NoElementComponent onActionClick={handleRetry} />;
  } else if (paginatedProducts.length === 0) {
    NoValue = <NoResultComponent />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Produits</h1>
        <input
          type="text"
          placeholder="Rechercher un produit"
          className="border rounded-md p-2 w-full md:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      {/* Filtres */}
      <section className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex flex-col">
          <label className="font-semibold">Prix maximum : {filters.priceRange[1]} {products[0].currency}</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={filters.priceRange[1]}
            onChange={(e) => setFilters({ ...filters, priceRange: [0, Number(e.target.value)] })}
          />
        </div>
        <select
          className="border rounded-md p-2"
          value={filters.brand}
          onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
        >
          <option value="">Toutes les marques</option>
          <option value="XYZ">XYZ</option>
          <option value="ABC">ABC</option>
        </select>
        <select
          className="border rounded-md p-2"
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
        >
          <option value="0">Toutes les notes</option>
          <option value="1">1 étoile</option>
          <option value="2">2 étoiles</option>
          <option value="3">3 étoiles</option>
          <option value="4">4 étoiles</option>
          <option value="5">5 étoiles</option>
        </select>
        <select
          className="border rounded-md p-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="price">Prix</option>
          <option value="rating">Note moyenne</option>
          <option value="popularity">Popularité</option>
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
          />
          <span>En stock uniquement</span>
        </label>
      </section>

      {/* Liste des produits */}
      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <ErrorComponent message={error} />
        </div>
      ) : (
      <section>
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginatedProducts.map((product: any) => (
            <Card
              key={product.id}
              title={product.name}
              description={`Prix : ${product.price} ${product.currency}`}
              image={product.image}
              // link={`/products/${product.id}`}
              // data={product}
              onActionClick={() => navigate(`/products/${product.id}`, { state: { productItems: product } })}
              footer={
                <div className="flex items-center justify-between mt-2">
                  <span className="text-yellow-500 font-semibold">
                    {Array.from({ length: Math.round(product.rating) }, (_, i) => "⭐").join("")}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {product.rating.toFixed(1)} étoiles
                  </span>
                </div>
              }
            />
          ))}
        </div>
        ) : (
          <p className="text-center text-gray-600">{NoValue}</p>
        )}
      </section>
      )}
      {/* Pagination */}
      <footer className="flex justify-between items-center mt-8">
        <Button
          label="Précédent"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          type="secondary"
          disabled={currentPage === 1}
        />
        <span className="text-gray-600">
          Page {currentPage} sur {totalPages}
        </span>
        <Button
          label="Suivant"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          type="secondary"
          disabled={currentPage === totalPages}
        />
      </footer>
    </div>
  );
};

export default ProductsPage;