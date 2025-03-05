import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader.tsx";
import Button from "../../components/Button.tsx";
import { Product } from "../../entities/Product.tsx";
import { DeleteProduct, fetchallInactiveProducts, fetchallPendingProducts, UpdateProduct } from "../../services/ProductService.ts"
import { updateData } from "../../utils/UpdateFunction.ts";
import { filterAndSortProduct } from "../../utils/ProductUtils.ts";
import { Category } from "../../entities/Categories.tsx";
import { CategoryIdName } from "../../services/CategoryService.ts";

const AdminProductValidationPage: React.FC = () => {
  const navigate = useNavigate();
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [inactiveProducts, setInactiveProducts] = useState<Product[]>([]);
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
        const pendingProducts: Product[] = await fetchallPendingProducts();
        setPendingProducts(pendingProducts);
        const inactiveProducts: Product[] = await fetchallInactiveProducts();
        setInactiveProducts(inactiveProducts);
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
      const updatedProduct = updateData(product_id, pendingProducts, ["category_id"], [selectedCategory.newCategory]);
      await UpdateProduct(product_id, updatedProduct);
      const categorys = await CategoryIdName();
      setPendingProducts((prevProducts) => 
        prevProducts.map((p) => 
          p.id === product_id ? {...p, category_id: categorys[selectedCategory.newCategory]} : p));
      setSelectedCategory(null);
    }
  };

  // Fonction pour valider un produit
  const handleValidateProduct = async (product_id: string) => {
    try {
      const updateProduct = updateData(product_id, pendingProducts, ["is_active", "is_pending"], [true, false]);
      if (updateProduct === null) {
        setMessage("Ce produit n'existe pas.");
      } else {
        const response = await UpdateProduct(product_id, updateProduct);

        if (response) {
          setPendingProducts(pendingProducts.filter((product) => product.id !== product_id));
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

  // Fonction pour activer un produit
  const handleActiveProduct = async (product_id: string) => {
    try {
      const updateProduct = updateData(product_id, inactiveProducts, ["is_active"], [true]);
      if (updateProduct === null) {
        setMessage("Ce produit n'existe pas.");
      } else {
        const response = await UpdateProduct(product_id, updateProduct);

        if (response) {
          setInactiveProducts(inactiveProducts.filter((product) => product.id !== product_id));
          setMessage("Produit activé avec succès.");
        } else {
          setMessage("Erreur lors de l'activation du produit.");
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
        setPendingProducts(pendingProducts.filter((product) => product.id !== product_id));
        setMessage("Produit refusé avec succès.");
      } else {
        setMessage("Erreur lors du refus du produit.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  // Fonction pour supprimer un produit inactif
  const handleDeleteInactiveProduct = async (product_id: string) => {
    try {
      const response = await DeleteProduct(product_id);

      if (response) {
        setInactiveProducts(inactiveProducts.filter((product) => product.id !== product_id));
        setMessage("Produit inactive supprimé avec succès.");
      } else {
        setMessage("Erreur lors de la suppression du produit inactif.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  const filteredPendingProducts = filterAndSortProduct(pendingProducts, search, "", "");
  const filteredInactiveProducts = filterAndSortProduct(inactiveProducts, search, "", "");
  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Produits Inactifs et en attente de validation</h1>
      {message && <p className="mb-4 text-green-500">{message}</p>}

      {/* Navigation vers les Catégories en actives */}
      <div className="flex justify-end gap-4 mb-6">
        <Button label="Voir les Produits Validés" onClick={() => navigate("/admin-product-management")}></Button>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex gap-4">
        <input type="text" placeholder="Filtrer les produits..." 
        className="border p-2 rounded-md" value={search} 
        onChange={(e) => setSearch((e.target as HTMLInputElement).value)} />
      </div>
      
      {/* Produits en attente */}
      <hr />
      <section className="mb-6 py-4">
        <h2 className="text-2xl font-semibold mb-4">Produits en attente</h2>
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
                  <Button label="Valider" onClick={() => handleValidateProduct(product.id)} />
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

      {/* Produits inactifs */}
      <hr />
      <section className="mb-6 py-8">
        <h2 className="text-2xl font-semibold mb-4">Produits Inatifs</h2>
        {filteredInactiveProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInactiveProducts.map((product) => (
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
                ( <input type="text"
                  className="border ml-2 p-1 rounded-md" 
                  value={selectedCategory.newCategory} 
                  onChange={(e) => setSelectedCategory({ id: product.id, newCategory: (e.target as HTMLInputElement).value })}
                  onBlur={(e) => handleEditCategory(product.id)} />) : (
                  <span onDoubleClick={(e) => setSelectedCategory({ id: product.id, newCategory: product.category_id })}>{product.category_id}</span>)}</p>
                <div className="flex justify-between mt-4">
                  <Button label="Activer" onClick={() => handleActiveProduct(product.id)} />
                  <Button
                    label="Supprimer"
                    onClick={() => handleDeleteInactiveProduct(product.id)}
                    type="danger"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucun produit inactifs.</p>
        )}
      </section>
    </div>
  );
};

export default AdminProductValidationPage;
