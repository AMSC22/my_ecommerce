import React, { useState } from "react";
import Button from "../../components/Button.tsx";
import { useNavigate } from "react-router-dom";

const SubmitTicketPage: React.FC = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category || !formData.description) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Ticket soumis avec succès !");
        setFormData({ category: "", description: "" });
      } else {
        setMessage("Erreur lors de la soumission du ticket.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Soumettre un ticket de support</h1>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Catégorie</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
          >
            <option value="">Sélectionnez une catégorie</option>
            <option value="Paiements">Paiements</option>
            <option value="Produits">Produits</option>
            <option value="Livraisons">Livraisons</option>
            <option value="Autres">Autres</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="border rounded-md p-2 w-full"
            rows={4}
          ></textarea>
        </div>
        <Button label="Soumettre" type="submit" onClick={() => navigate("/user-tickets")}/>
      </form>
    </div>
  );
};

export default SubmitTicketPage;