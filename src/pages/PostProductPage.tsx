import React, { useState, useEffect } from "react";
import Button from "../components/Button.tsx";
import { fetchvalidatedCategories, CreateCategory } from "../services/CategoryService.ts";
import { Category } from "../entities/Categories.tsx";
import { addProduct } from "../services/ProductService.ts";

const PostProductPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({name: "", description: "", Image: null as File | null});
  const [createCategory, setCreateCategory] = useState(false);
  const [unit, setUnit] = useState("unité"); // Ajout de l'unité de mesure
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "XAF",
    country: "",
    category_id: "",
    seller_id: "",
    quantity: 1,
    dimensions: "",
    weight: "",
    unit: "pièce", // Nouvelle valeur
    images: [] as File[],
    is_active: false,
    is_pending: true,
    status: "available"
  });
  const [message, setMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string[]>([]);
  const [previewImageCat, setPreviewImageCat] = useState<string | null>(null);

  const user_id = localStorage.getItem("user_id") || ""; // Récupération de l'utilisateur connecté

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await fetchvalidatedCategories();
        setCategories(categories);
      } catch (error) {
        setMessage("Erreur lors du chargement des catégories.");
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prevData) => ({...prevData, images: [...prevData.images, ...files],}));
      setPreviewImage((prevImage) => ([...prevImage, ...files.map((file) => URL.createObjectURL(file))])); // Prévisualisation multiple
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prevData) => ({...prevData, images: prevData.images.filter((_, i) => i != index),})); // Supprimer une image sélectionnée
    setPreviewImage((prevImage) => prevImage.filter((_, i) => i != index)); // Supprimer une Prévisualisation
  };

  const handleImageCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setNewCategory({ ...newCategory, Image: file });
      setPreviewImageCat(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async () => {
    if (newCategory) {
      try {
        const categoryObject = new FormData();
        categoryObject.append("name", newCategory.name || "");
        categoryObject.append("description", newCategory.description || "");
        categoryObject.append("created_by", user_id);
        if (newCategory.Image) {
          categoryObject.append("icon_url", newCategory.Image); 
        } else {
          categoryObject.append("icon_url", new File([], ""));
        }
        categoryObject.append("is_active", "false");
        categoryObject.append("is_pending", "true");
        categoryObject.append("productCount", "0");
        categoryObject.append("sales", "0");
        const category = await CreateCategory(categoryObject);
        if (category) {
          setMessage("Nouvelle catégorie ajoutée !");
          setFormData({ ...formData, category_id: category.id });
          setCreateCategory(false); // Masquer l'input après ajout
          setNewCategory({name: "", description: "", Image: null as File | null});
        } else {
          setMessage("Erreur lors de l'ajout de la catégorie !");
        } 
      } catch (error) {
        setMessage("Erreur de connection au serveur. Veuillez réessayer.");
      }
    }
  };

  const handleSubmit = async () => {
    // e.preventDefault();
    console.log("formData = ", formData);

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.country ||
      !formData.category_id ||
      !formData.images ||
      formData.quantity <= 0
    ) {
      setMessage("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("seller_id", user_id);
      formDataToSend.append("currency", formData.currency);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("quantity", formData.quantity.toString());
      formDataToSend.append("unit", formData.unit); // Ajout de l'unité de mesure
      formDataToSend.append("dimensions", formData.dimensions || "");
      formDataToSend.append("weight", formData.weight || "");
      formData.images.forEach((image) => {formDataToSend.append("images", image)});

      const response = await addProduct(formDataToSend);
      console.log("response = ", response);

      // if (response) {
      //   setMessage("Produit soumis avec succès, en attente de validation !");
      //   setFormData({
      //     name: "",
      //     description: "",
      //     price: "",
      //     currency: "XAF",
      //     country: "",
      //     category_id: "",
      //     seller_id: "",
      //     quantity: 1,
      //     dimensions: "",
      //     weight: "",
      //     unit: "pièce", // Nouvelle valeur
      //     image: [] as File[],
      //     is_active: false,
      //     is_pending: true,
      //     status: "available"
      //   });
      //   setPreviewImage([]);
      // } else {
      //   setMessage("Une erreur est survenue.");
      // }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

return (
  <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
    <h1 className="text-2xl font-bold mb-4 text-center">Poster un produit</h1>
    {message && <p className="mb-4 text-red-500 text-center">{message}</p>}

    {/* Conteneur avec affichage responsive */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* 📌 SECTION GAUCHE - Formulaire du produit */}
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Nom du produit</label>
          <input type="text" placeholder="Nom du produit" name="name" value={formData.name} onChange={handleInputChange} className="border rounded-md p-2 w-full" />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea placeholder="Description du produit" name="description" value={formData.description} onChange={handleInputChange} className="border rounded-md p-2 w-full"></textarea>
        </div>
        <div>
          <label className="block font-semibold">Pays</label>
          <input type="text" name="country" placeholder="Pays du produit" value={formData.country} onChange={handleInputChange} className="border rounded-md p-2 w-full" />
        </div>
        <div>
          <label className="block font-semibold">Prix</label>
          <input type="number" placeholder="Prix du produit" name="price" value={formData.price} onChange={handleInputChange} className="border rounded-md p-2 w-full" />
        </div>
        <div>
          <label className="block font-semibold">Quantité</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min={1} className="border rounded-md p-2 w-full" />
        </div>
        <div>
          <label className="block font-semibold">Unité</label>
          <select name="unit" value={formData.unit} onChange={handleInputChange} className="border rounded-md p-2 w-full">
            <option value="pièce">Par pièce</option>
            <option value="kg">Kg</option>
            <option value="litre">Litre</option>
            <option value="mètre">Mètre</option>
            <option value="sac">Sac</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Catégorie</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={(e) => {
              if (e.target.value === "create_new") {
                setCreateCategory(true);
              } else {
                setFormData({ ...formData, category_id: e.target.value });
              }
            }}
            className="border rounded-md p-2 w-full"
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
            <option disabled>──────────</option>
            <option value="create_new">➕ Créer une nouvelle catégorie</option>
          </select>
        </div>
        {/* Formulaire pour créer une nouvelle catégorie */}
        {createCategory && (
          <div className="border rounded-md p-4 shadow-md bg-gray-50">
            <h2 className="font-bold text-lg">Ajouter une nouvelle catégorie</h2>
            {/* Champ de saisie affiché uniquement si createCategory est vrai */}
            {createCategory && (
                <div>
                  <div className="mt-2">
                    <label className="block font-semibold">Nom de la catégorie</label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="Nouvelle catégorie"
                      className="border rounded-md p-2 w-full"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block font-semibold">Description</label>
                    <input
                      type="text"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Description de la catégorie"
                      className="border rounded-md p-2 w-full"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold">Image</label>
                    <input type="file" name="image" onChange={handleImageCategory} />
                    {previewImageCat && <img src={previewImageCat} alt="Prévisualisation" className="mt-4 w-full h-auto object-cover rounded-md" />}
                  </div>
                  <div className="grid grid-cols-2 ">
                    <div className="mt-2">
                      <Button label="Ajouter" className="mt-2 space-y-4" onClick={handleAddCategory} />
                    </div>
                    <div className="mt-2">
                      <Button label="Annuler" className="mt-2 space-y-4" onClick={() => setCreateCategory(false)} />
                    </div>
                  </div>
                </div>
              )}
          </div>
        )}
        
      </div>

      {/* 📌 SECTION DROITE - Images */}
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Images du produit</label>
          <input type="file" name="images" multiple onChange={handleImageChange} className="border rounded-md p-2 w-full" />
          <div className="grid grid-cols-3 gap-4 mt-4">
            {previewImage.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} alt={`Prévisualisation ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                <button 
                type="button" 
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => handleRemoveImage(index) }> X </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bouton d'envoi */}
      <Button label="Soumettre" type="submit" onClick={handleSubmit} />


    </div>
  </div>
);
};

export default PostProductPage;
