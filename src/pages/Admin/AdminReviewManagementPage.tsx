import React, { useState, useEffect } from "react";
import Button from "../../components/Button.tsx";
import Loader from "../../components/Loader.tsx";
import { fetchAllReviews, UpdateReview, DeleteReview } from "../../services/ReviewService.ts";
import { Review } from "../../entities/Reviews.tsx";
import { updateData } from "../../utils/UpdateFunction.ts";

const AdminReviewManagementPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState({ rating: 0, user: "", product: "" });
  const [sortField, setSortField] = useState<"rating" | "date" | "product_name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation de récupération des avis
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setMessage(null);
        const mockReviews: Review[] = await fetchAllReviews();
        setReviews(mockReviews);
        setLoading(false);
        setMessage(null);
      } catch (error: any) {
        setMessage("Erreur de chargement des avis.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Trier les avis
  const sortedReviews = [...reviews].sort((a: any, b: any) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
    return valueA < valueB ? 1 : -1;
  });

  // Filtrer les avis
  const filteredReviews = sortedReviews.filter(
    (review) =>
      (filter.rating === 0 || review.rating === filter.rating) &&
      (filter.user === "" || review.user_id.toLowerCase().includes(filter.user.toLowerCase())) &&
      (filter.product === "" || review.product_name.toLowerCase().includes(filter.product.toLowerCase()))
  );

  // Gérer les actions
  const handleApprove = async (review_id: string) => {
    try {
      const updateReview = updateData(review_id, reviews, ["statut"], [true]);
      if (updateReview === null) {
        setMessage("Cet avis n'existe pas.");
      } else {
        const response = await UpdateReview(review_id, updateReview);

        if (response) {
          setReviews((prevReviews) =>
            prevReviews.map((review) =>
              review.id === review_id ? updateReview : review
            )
          );
          setMessage("Avis approuvé avec succès.");
        } else {
          setMessage("Erreur lors de la validation du produit.");
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  const handleDelete = async (review_id: string) => {
    try {
      const response = await DeleteReview(review_id);

      if (response) {
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== review_id));
        setMessage("Avis supprimé avec succès.");
      } else {
        setMessage("Erreur lors de la suppression de l'avis.");
      }
      
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  const exportData = () => {
    const csvContent = [
      ["Utilisateur", "Produit", "Note", "Commentaire", "Date", "Statut"],
      ...filteredReviews.map((review) => [
        review.user_id,
        review.product_name,
        review.rating,
        review.comment,
        review.created_at.split("T")[0],
        review.statut ? "Approuvé" : "En attente",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reviews.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Statistiques
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews || 0;

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white shadow-md rounded-md">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Gestion des avis</h1>
        <p className="text-gray-600">Modérez les avis laissés par les utilisateurs sur les produits.</p>
      </header>

      {/* Message */}
      {message && (
        <div className="mb-6 bg-green-100 text-green-800 p-4 rounded-md">
          {message}
        </div>
      )}

      {/* Statistiques */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-100 p-4 rounded-md">
          <h2 className="text-lg font-bold">Total des avis</h2>
          <p className="text-2xl font-semibold">{totalReviews}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-md">
          <h2 className="text-lg font-bold">Note moyenne</h2>
          <p className="text-2xl font-semibold">{averageRating.toFixed(1)} ⭐</p>
        </div>
      </section>

      {/* Filtres */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-2">Filtres</h2>
        <div className="flex flex-wrap gap-4">
          <select
            value={filter.rating}
            onChange={(e) => setFilter({ ...filter, rating: Number(e.target.value) })}
            className="border rounded-md p-2"
          >
            <option value={0}>Toutes les notes</option>
            <option value={5}>5 étoiles</option>
            <option value={4}>4 étoiles</option>
            <option value={3}>3 étoiles</option>
            <option value={2}>2 étoiles</option>
            <option value={1}>1 étoile</option>
          </select>
          <input
            type="text"
            placeholder="Rechercher par utilisateur"
            value={filter.user}
            onChange={(e) => setFilter({ ...filter, user: e.target.value })}
            className="border rounded-md p-2 flex-1"
          />
          <input
            type="text"
            placeholder="Rechercher par produit"
            value={filter.product}
            onChange={(e) => setFilter({ ...filter, product: e.target.value })}
            className="border rounded-md p-2 flex-1"
          />
          <Button label="Exporter" onClick={exportData} className="bg-blue-500 text-white px-4 py-2" />
        </div>
      </section>

      {/* Tableau des avis */}
      <section className="bg-white shadow-md rounded-md overflow-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Utilisateur</th>
              <th className="border p-2">Produit</th>
              <th className="border p-2">Note</th>
              <th className="border p-2">Commentaire</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <tr key={review.id}>
                  <td className="border p-2">{review.user_id}</td>
                  <td className="border p-2">{review.product_name}</td>
                  <td className="border p-2">{`${review.rating} ⭐`}</td>
                  <td className="border p-2">{review.comment}</td>
                  <td className="border p-2">{review.created_at.split("T")[0]}</td>
                  <td className="border p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        (review.statut ? "Approuvé" : "En attente") === "Approuvé"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {(review.statut ? "Approuvé" : "En attente")}
                    </span>
                  </td>
                  <td className="border p-2 flex gap-2">
                    {(review.statut ? "Approuvé" : "En attente") === "En attente" && (
                      <Button
                        label="Approuver"
                        onClick={() => handleApprove(review.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-md"
                      />
                    )}
                    <Button
                      label="Supprimer"
                      onClick={() => handleDelete(review.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-gray-600 py-4">
                  Aucun avis trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminReviewManagementPage;
