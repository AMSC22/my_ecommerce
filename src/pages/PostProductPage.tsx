import React, { useState, useEffect } from "react";
import Button from "../components/Button.tsx";

interface Category {
  id: number;
  name: string;
}

const PostProductPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "EUR",
    country: "",
    category: "",
    quantity: 1,
    dimensions: "",
    weight: "",
    image: null as File | null, // Correction ici
  });
  const [message, setMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
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
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCategoryObject: Category = { id: Date.now(), name: newCategory };
      setCategories([...categories, newCategoryObject]);
      setFormData({ ...formData, category: newCategory });
      setNewCategory("");
      setMessage("Nouvelle catégorie ajoutée !");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category ||
      !formData.image ||
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
      formDataToSend.append("currency", formData.currency);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("quantity", formData.quantity.toString());
      formDataToSend.append("dimensions", formData.dimensions);
      formDataToSend.append("weight", formData.weight);
      formDataToSend.append("image", formData.image);

      const response = await fetch("/api/products", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        setMessage("Produit soumis avec succès, en attente de validation !");
        setFormData({
          name: "",
          description: "",
          price: "",
          currency: "EUR",
          country: "",
          category: "",
          quantity: 1,
          dimensions: "",
          weight: "",
          image: null,
        });
        setPreviewImage(null);
      } else {
        setMessage("Une erreur est survenue.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Poster un produit</h1>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nom du produit</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
          ></textarea>
        </div>
        <div>
          <label className="block font-semibold">Prix</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Quantité</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min={1}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Dimensions (optionnel)</label>
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleInputChange}
            placeholder="Exemple : 10x15x20 cm"
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Poids (optionnel)</label>
          <input
            type="text"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder="Exemple : 1.5 kg"
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Monnaie</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="XAF">XAF</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Pays (optionnel)</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Catégorie</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="mt-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Ajouter une nouvelle catégorie"
              className="border rounded-md p-2 w-full"
            />
            <Button label="Ajouter" onClick={handleAddCategory} />
          </div>
        </div>
        <div>
          <label className="block font-semibold">Image</label>
          <input type="file" name="image" onChange={handleImageChange} />
          {previewImage && (
            <img
              src={previewImage}
              alt="Prévisualisation"
              className="mt-4 w-full h-48 object-cover rounded-md"
            />
          )}
        </div>
        <Button label="Soumettre" type="submit" onClick={() => handleSubmit} />
      </form>
    </div>
  );
};

export default PostProductPage;
