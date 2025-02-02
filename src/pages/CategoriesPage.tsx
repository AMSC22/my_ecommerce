import React, { useState, useEffect } from "react";
import Loader from "../components/Loader.tsx";
import Card from "../components/Card.tsx";
import Button from "../components/Button.tsx";
import { Category } from "../entities/Categories.tsx";
import { fetchvalidatedCategories, fetchCategoryStats } from "../services/CategoryService.ts";
import { filterAndSortCategories } from "../utils/CategoryUtils.ts";
// import { ToastContainer, toast } from "react-toastify/dist/ReactToastify.css"; // npm install react-toastify
import NoElementComponent from "../components/NoElementComponent.tsx"
import ErrorComponent from "../components/ErrorComponent.tsx";

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 12; // Nombre d'éléments par page

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const allCategories: Category[] = await fetchvalidatedCategories();
        const categoriesWithStats = await fetchCategoryStats(allCategories);
        setCategories(categoriesWithStats);
        setLoading(false);
        setError(null);          
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Filtrage et tri des catégories
  const filteredCategories = filterAndSortCategories(categories, search, sortBy, order);

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  if (loading) return <Loader />;

  return (
    <div className="p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between mb-6">
        {/* <ToastContainer /> */}
        <h1 className="text-3xl font-bold">Catégories</h1>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <input
            type="text"
            placeholder="Rechercher une catégorie"
            className="border rounded-md p-2 w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="border rounded-md p-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Nom</option>
            <option value="productCount">Nombre de produits</option>
            <option value="sales">Ventes</option>
          </select>
          <select
            className="border rounded-md p-2"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          >
            <option value="asc">Ascendant</option>
            <option value="desc">Descendant</option>
          </select>
        </div>
      </header>

      {/* Liste des catégories */}
      {error ? (
        <ErrorComponent message={error}/>
      ) : (
      <section>
        {paginatedCategories.length === 0 ? (
          <NoElementComponent />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedCategories.map((category) => (
              <Card
                key={category.id}
                title={`${category.name} : ${category.description}`}
                description={`${category.productCount} produits`}
                footer={`Ventes : ${category.sales} €`}
                image={category.icon_url}
                link={`/categories/${category.id}/products`}
              />
            ))}
          </div>
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
        <span className="text-gray-500">
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

export default CategoriesPage;
