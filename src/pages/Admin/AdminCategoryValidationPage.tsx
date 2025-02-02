import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader.tsx";
import Button from "../../components/Button.tsx";
import { Category } from "../../entities/Categories.tsx";
import { fetchPendingCategories, fetchInactiveCategories, UpdateCategory, DeleteCategory } from "../../services/CategoryService.ts";
import { updateData } from "../../utils/UpdateFunction.ts";
import { filterAndSortCategories } from "../../utils/CategoryUtils.ts";

const AdminCategoryValidationPage: React.FC = () => {
  const navigate = useNavigate();
  const [pendingCategories, setPendingCategories] = useState<Category[]>([]);
  const [inactivecategories, setInactiveCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const user_id = "6796bc4f387b9c8670791537"
  // Chargement des données du Panier
  useEffect(() => {
    const loadCarts = async () => {
      try {
        setLoading(true);
        setMessage(null);
        const pendingCategories: Category[] = await fetchPendingCategories();
        setPendingCategories(pendingCategories);
        const inactiveCategories: Category[] = await fetchInactiveCategories();
        setInactiveCategories(inactiveCategories);
        setLoading(false);
        setMessage(null);
      } catch (error: any) {
        setMessage("Erreur de chargement des catégories.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    loadCarts();
  }, []);

  // Fonction pour valider une catégorie
  const handleValidateCategory = async (category_id: string) => {
    try {
      const updateCategory = updateData(category_id, pendingCategories, ["is_active", "is_pending"], [true, false]);
      if (updateCategory === null) {
        setMessage("Ce produit n'existe pas.");
      } else {
        const response = await UpdateCategory(category_id, updateCategory);

        if (response) {
          setPendingCategories(pendingCategories.filter((category) => category.id !== category_id));
          setMessage("Produit validé avec succès.");
        } else {
          setMessage("Erreur lors de la validation du produit.");
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  // Fonction pour activer une catégorie
  const handleActiveCategory = async (category_id: string) => {
    try {
      const updateCategory = updateData(category_id, inactivecategories, ["is_active"], [true]);
      if (updateCategory === null) {
        setMessage("Ce produit n'existe pas.");
      } else {
        const response = await UpdateCategory(category_id, updateCategory);

        if (response) {
          setInactiveCategories(inactivecategories.filter((category) => category.id !== category_id));
          setMessage("Catégorie validée avec succès.");
        } else {
          setMessage("Erreur lors de la validation de la catégorie.");
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  // Fonction pour refuser une catégorie
  const handleDeletePendingCategory = async (category_id: string) => {
    try {
      const response = await DeleteCategory(category_id);

      if (response.ok) {
        setPendingCategories(pendingCategories.filter((category) => category.id !== category_id));
        setMessage("Catégorie supprimée avec succès.");
      } else {
        setMessage("Erreur lors de la suppression de la catégorie.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

    // Fonction pour refuser une catégorie
  const handleDeleteInactiveCategory = async (category_id: string) => {
    try {
        const response = await DeleteCategory(category_id);

        if (response.ok) {
        setInactiveCategories(inactivecategories.filter((category) => category.id !== category_id));
        setMessage("Catégorie inactive supprimée avec succès.");
        } else {
        setMessage("Erreur lors de la suppression de la catégorie.");
        }
    } catch (error) {
        console.error(error);
        setMessage("Erreur de connexion au serveur.");
    }
  };

  const filteredPendingCategoy = filterAndSortCategories(pendingCategories, search, "", "");
  const filteredInactiveCategory = filterAndSortCategories(inactivecategories, search, "", "");
  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Catégories Inactives et en attente de validation</h1>
      {message && <p className="mb-4 text-green-500">{message}</p>}

      {/* Navigation vers les Catégories en actives */}
      <div className="flex justify-end gap-4 mb-6">
        <Button label="Voir les Catégories Validées" onClick={() => navigate("/admin-category")}></Button>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex gap-4">
        <input type="text" placeholder="Filtrer les catégories..." 
        className="border p-2 rounded-md" value={search} 
        onChange={(e) => setSearch((e.target as HTMLInputElement).value)} />
      </div>
      
      {/* Catégories en attente */}
      <hr />
      <section className="mb-6 py-4">
        <h2 className="text-2xl font-semibold mb-4">Catégories en attente</h2>
        {filteredPendingCategoy.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPendingCategoy.map((category) => (
              <div key={category.id} className="border rounded-md p-4">
                <img
                  src={category.icon_url}
                  alt={category.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold text-lg">{category.name}</h3>
                <div className="flex justify-between mt-4">
                  <Button label="Valider" onClick={() => handleValidateCategory(category.id)} />
                  <Button
                    label="Refuser"
                    onClick={() => handleDeletePendingCategory(category.id)}
                    type="danger"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune catégorie en attente de validation.</p>
        )}
      </section>

      {/* Catégories Inactive */}
      <hr />
      <section className="mb-6 p-8">
        <h2 className="text-2xl font-semibold mb-4">Catégories Inactives</h2>
        {filteredInactiveCategory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInactiveCategory.map((category) => (
              <div key={category.id} className="border rounded-md p-4">
                <img
                  src={category.icon_url}
                  alt={category.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold text-lg">{category.name}</h3>
                <div className="flex justify-between mt-4">
                  <Button label="Activer" onClick={() => handleActiveCategory(category.id)} />
                  <Button
                    label="Supprimer"
                    onClick={() => handleDeleteInactiveCategory(category.id)}
                    type="danger"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune catégorie inactive.</p>
        )}
      </section>
    </div>
  );
};

export default AdminCategoryValidationPage;
