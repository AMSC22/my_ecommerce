import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";
import { fetchCategories, DeleteCategory } from "../../services/CategoryService.ts";
import { Category, SubCategory } from "../../entities/Categories.tsx";

const CategoryManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  //   { id: 1, name: "Électronique", subcategories: [{ id: 1, name: "Smartphones" }, { id: 2, name: "Tablettes" }] },
  //   { id: 2, name: "Mode", subcategories: [{ id: 3, name: "Vêtements" }, { id: 4, name: "Chaussures" }] },
  // ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const user_id = "6796bc4f387b9c8670791537"
  // Chargement des données du Panier
  useEffect(() => {
    const loadCarts = async () => {
      try {
        setLoading(true);
        setError(null);
        const allCategories: Category[] = await fetchCategories();
        setCategories(allCategories);
        setLoading(false);
        setError(null);
      } catch (error: any) {
        setError("Erreur de chargement des catégories.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    loadCarts();
  }, []);

  // const handleAddCategory = () => {
  //   if (!newCategoryName.trim()) return;
  //   const newCategory: Category = {
  //     id: categories.length + 1,
  //     name: newCategoryName.trim(),
  //     subcategories: [],
  //   };
  //   setCategories([...categories, newCategory]);
  //   setNewCategoryName("");
  // };

  // const handleAddSubcategory = () => {
  //   if (!newSubcategoryName.trim() || selectedCategoryId === null) return;
  //   const updatedCategories = categories.map((category) =>
  //     category.id === selectedCategoryId
  //       ? {
  //           ...category,
  //           subcategories: [
  //             ...category.parent_category_id || "",
  //             { id: category.subcategories.length + 1, name: newSubcategoryName.trim() },
  //           ],
  //         }
  //       : category
  //   );
  //   setCategories(updatedCategories);
  //   setNewSubcategoryName("");
  // };

  const handleDeleteCategory = async (categoryId: string) => {
    const response = await DeleteCategory(categoryId);
    try{
      if (response){
        const updatedCategories = categories.filter((category) => category.id !== categoryId);
        setCategories(updatedCategories);
        if (selectedCategoryId === categoryId) setSelectedCategoryId(null);
        setMessage("Catégorie supprimée avec succès.");
      } else {
        setMessage("Erreur lors de la suppression de la catégorie.");
      }
    } catch (error) {
    console.error(error);
    setMessage("Erreur de connexion au serveur.");
    }
  };

  // const handleDeleteSubcategory = (categoryId: number, subcategoryId: number) => {
  //   const updatedCategories = categories.map((category) =>
  //     category.id === categoryId
  //       ? {
  //           ...category,
  //           subcategories: category.subcategories.filter((subcategory) => subcategory.id !== subcategoryId),
  //         }
  //       : category
  //   );
  //   setCategories(updatedCategories);
  // };

  return (
    <div className="p-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Gestion des catégories</h1>
        <p className="text-gray-600">
          Gérez les catégories et sous-catégories des produits disponibles sur la plateforme.
        </p>
        {message && <p className="mb-4 text-green-500">{message}</p>}
      </header>

      {/* Ajout de catégories */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Ajouter une catégorie</h2>
        <div className="flex gap-4 items-center">
          <Button
            label="Créer une nouvelle catégorie"
            onClick={() => navigate("/admin-create-category")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          />
        </div>
      </section>

      {/* Liste des catégories */}
      <section>
        <h2 className="text-xl font-bold mb-4">Catégories existantes</h2>
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="mb-6 border rounded-md p-4 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <img src={category.icon_url} alt={category.name} className="w-16 h-16 rounded-md object-cover" /> 
                </div>
                <h3 className="text-lg font-bold">{category.name}</h3>
                <Button
                  label="Supprimer"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                />
              </div>

              {/* Sous-catégories */}
              {/* <div className="ml-4">
                <h4 className="text-md font-semibold mb-2">Sous-catégories</h4>
                {category.subcategories.length > 0 ? (
                  category.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex justify-between items-center mb-2">
                      <span>{subcategory.name}</span>
                      <Button
                        label="Supprimer"
                        onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                        className="bg-gray-500 text-white px-2 py-1 rounded-md"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Aucune sous-catégorie.</p>
                )}
              </div> */}

              {/* Ajouter une sous-catégorie */}
              {/* <div className="mt-4">
                <h4 className="text-md font-semibold mb-2">Ajouter une sous-catégorie</h4>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={selectedCategoryId === category.id ? newSubcategoryName : ""}
                    onChange={(e) => {
                      setNewSubcategoryName(e.target.value);
                      setSelectedCategoryId(category.id);
                    }}
                    placeholder="Nom de la sous-catégorie"
                    className="border rounded-md p-2 flex-1"
                  />
                  <Button
                    label="Ajouter"
                    onClick={handleAddSubcategory}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  />
                </div>
              </div> */}
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucune catégorie disponible.</p>
        )}
      </section>
    </div>
  );
};

export default CategoryManagementPage;