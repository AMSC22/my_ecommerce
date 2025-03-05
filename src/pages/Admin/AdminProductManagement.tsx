import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader.tsx";
import Button from "../../components/Button.tsx";
import { Product } from "../../entities/Product.tsx";
import { DeleteProduct, UpdateProduct, fetchAllValidatedProducts, fetchProductStats } from "../../services/ProductService.ts"
import { updateData } from "../../utils/UpdateFunction.ts";
import { filterAndSortProduct } from "../../utils/ProductUtils.ts";
import { fetchCategories } from "../../services/CategoryService.ts";
import { Category } from "../../entities/Categories.tsx";
import { CategoryIdName } from "../../services/CategoryService.ts";

const AdminProductManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [validatedProducts, setValidatedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string, newCategory: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement des données du Panier
  useEffect(() => {
    const loadCarts = async () => {
      try {
        setLoading(true);
        setMessage(null);
        const validatedProducts: Product[] = await fetchAllValidatedProducts();
        const category: Category[] = await fetchCategories();
        setCategories(category);
        const validatedStats = await fetchProductStats(validatedProducts);
        setValidatedProducts(validatedStats);
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

  // Fonction pour modifier le nom d'une catégorie sur un produit
  const handleEditCategory = async (product_id: string) => {
    if (selectedCategory && selectedCategory.id === product_id) {
      const updatedProduct = updateData(product_id, validatedProducts, ["category_id"], [selectedCategory.newCategory]);
      await UpdateProduct(product_id, updatedProduct);
      const categorys = await CategoryIdName();
      setValidatedProducts((prevProducts) => 
        prevProducts.map((p) => 
          p.id === product_id ? {...p, category_id: categorys[selectedCategory.newCategory]} : p));
      setSelectedCategory(null);
    }
  };
  
  // Fonction pour valider un produit
  const handleValidateProduct = async (product_id: string) => {
    try {
      const updateProduct = updateData(product_id, validatedProducts, ["is_active", "is_pending"], [false, false]);
      if (updateProduct === null) {
        setMessage("Ce produit n'existe pas.");
      } else {
        const response = await UpdateProduct(product_id, updateProduct);

        if (response) {
          setValidatedProducts(validatedProducts.filter((product) => product.id !== product_id));
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

  // Fonction pour supprimer un produit en attente
  const handleDeletePendingProduct = async (product_id: string) => {
    try {
      const response = await DeleteProduct(product_id);

      if (response) {
        setValidatedProducts(validatedProducts.filter((product) => product.id !== product_id));
        setMessage("Produit refusé avec succès.");
      } else {
        setMessage("Erreur lors du refus du produit.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  const filteredPendingProducts = filterAndSortProduct(validatedProducts, search, "", "");
  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Produits actifs</h1>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      
      {/* Navigation vers les Prouits en inactifs */}
      <div className="flex justify-end gap-4 mb-6">
        <Button label="Retour" onClick={() => navigate("/admin-validation-product")}></Button>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex gap-4">
        <input type="text" placeholder="Filtrer les produits..." 
        className="border p-2 rounded-md" value={search} 
        onChange={(e) => setSearch((e.target as HTMLInputElement).value)} />
      </div>
      
      {/* Produits validés */}
      <section className="mb-6 py-4">
        {filteredPendingProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPendingProducts.map((product) => (
              <div key={product.id} className="border rounded-md p-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm">{product.description}</p>
                <p className="text-blue-600 font-semibold">{product.price} {product.currency}</p>
                <p className="text-gray-500 text-sm">Catégorie : {selectedCategory?.id === product.id ? 
                ( <select value={selectedCategory.newCategory} 
                    onChange={(e) => setSelectedCategory({ id: product.id, newCategory: (e.target).value })}
                    onKeyDown={(e) => e.key === "Enter" && handleEditCategory(product.id)}
                    className="border ml-2 p-1 rounded-md" >{categories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>))}
                        <option disabled>----------</option>
                        <option value="new">+ Créer une nouvelle catégorie</option></select>
                ) : (
                  <span onDoubleClick={(e) => setSelectedCategory({ id: product.id, newCategory: product.category_id })}>{product.category_id}</span>)}</p>
                <div className="flex justify-between mt-4">
                  <Button label="Bloquer" onClick={() => handleValidateProduct(product.id)} />
                  <Button
                    label="Refuser"
                    onClick={() => handleDeletePendingProduct(product.id)}
                    type="danger"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun produit en attente de validation.</p>
        )}
      </section>
    </div>
  );
};

export default AdminProductManagementPage;
