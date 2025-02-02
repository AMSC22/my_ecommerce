import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";
import { CreateCategory } from "../../services/CategoryService.ts";
import { Category } from "../../entities/Categories.tsx";

const CreateCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [icon_url, setIcon_url] = useState<string>("");

  const user_id = "6796bc4f387b9c8670791537"
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      setIcon_url(URL.createObjectURL(file));
      setPreviewImage(URL.createObjectURL(file)); // Prévisualiser l'image
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName || !description || !image) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    console.log("icon_url = ", icon_url.split("/"));
    try {
      const formData = new FormData();
      formData.append("name", categoryName);
      formData.append("description", description);
      formData.append("created_by", user_id);
      formData.append("parent_category_id", "");
      formData.append("icon_url", image);
      formData.append("is_active", "true");
      formData.append("is_pending", "false");
      formData.append("productCount", "0");
      formData.append("sales", "0");

      // {
      //   "name": categoryName,
      //   "description": description,
      //   "created_by": user_id,
      //   "parent_category_id": "",
      //   "icon_url": icon_url.split("/")[3],
      //   "is_active": true,
      //   "is_pending": false,
      //   "productCount": 0,
      //   sales: 0,}

      // Création d'une catégorie
      setLoading(true);
      setError(null);
      const allwishlists: Category[] = await CreateCategory(formData);
      setLoading(false);
      setError(null);          
        

      if (allwishlists) {
        setMessage("Catégorie créée avec succès !");
        // Redirection vers CategoryManagementPage
        setTimeout(() => navigate("/admin-category-management"), 2000);
        setCategoryName("");
        setDescription("");
        setImage(null);
        setPreviewImage(null);
      } else {
        setMessage("Une erreur est survenue.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Créer une catégorie</h1>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Nom de la catégorie</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-md p-2 w-full"
          ></textarea>
        </div>
        <div>
          <label className="block font-semibold">Image</label>
          <input type="file" onChange={handleImageChange} />
          {previewImage && (
            <img
              src={previewImage}
              alt="Prévisualisation"
              className="mt-4 w-full h-62 object-cover rounded-md"
            />
          )}
        </div>
        <div className="flex gap-4">
          <Button label="Créer" type="submit" onClick={() => handleSubmit}/>
          <Button
            label="Retour"
            type="secondary"
            onClick={() => navigate("/admin-category-management")}
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCategoryPage;
