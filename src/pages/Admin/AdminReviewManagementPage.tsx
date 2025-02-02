import React, { useState, useEffect } from "react";
import Button from "../../components/Button.tsx";
import Tooltip from "../../components/TooltipProps.tsx";

interface Review {
  id: number;
  userName: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  status: "Approuvé" | "En attente";
}

const AdminReviewManagementPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState({ rating: 0, user: "", product: "" });
  const [sortField, setSortField] = useState<"rating" | "date" | "productName">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Simulation de récupération des avis
    const fetchReviews = async () => {
      const mockReviews: Review[] = [
        {
          id: 1,
          userName: "Alice Dupont",
          productName: "Smartphone XYZ",
          rating: 5,
          comment: "Excellent produit, je recommande !",
          date: "2025-01-10",
          status: "Approuvé",
        },
        {
          id: 2,
          userName: "Jean Martin",
          productName: "Casque Bluetooth ABC",
          rating: 3,
          comment: "Correct, mais peut mieux faire.",
          date: "2025-01-09",
          status: "En attente",
        },
        {
          id: 3,
          userName: "Marie Curie",
          productName: "Tablette DEF",
          rating: 4,
          comment: "Très satisfait de mon achat.",
          date: "2025-01-08",
          status: "Approuvé",
        },
      ];
      setReviews(mockReviews);
    };

    fetchReviews();
  }, []);

  // Trier les avis
  const sortedReviews = [...reviews].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (sortOrder === "asc") return valueA > valueB ? 1 : -1;
    return valueA < valueB ? 1 : -1;
  });

  // Filtrer les avis
  const filteredReviews = sortedReviews.filter(
    (review) =>
      (filter.rating === 0 || review.rating === filter.rating) &&
      (filter.user === "" || review.userName.toLowerCase().includes(filter.user.toLowerCase())) &&
      (filter.product === "" || review.productName.toLowerCase().includes(filter.product.toLowerCase()))
  );

  // Gérer les actions
  const handleApprove = (id: number) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id ? { ...review, status: "Approuvé" } : review
      )
    );
    setMessage("Avis approuvé avec succès.");
  };

  const handleDelete = (id: number) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id));
    setMessage("Avis supprimé avec succès.");
  };

  const exportData = () => {
    const csvContent = [
      ["Utilisateur", "Produit", "Note", "Commentaire", "Date", "Statut"],
      ...filteredReviews.map((review) => [
        review.userName,
        review.productName,
        review.rating,
        review.comment,
        review.date,
        review.status,
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
                  <td className="border p-2">{review.userName}</td>
                  <td className="border p-2">{review.productName}</td>
                  <td className="border p-2">{`${review.rating} ⭐`}</td>
                  <td className="border p-2">{review.comment}</td>
                  <td className="border p-2">{review.date}</td>
                  <td className="border p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        review.status === "Approuvé"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>
                  <td className="border p-2 flex gap-2">
                    {review.status === "En attente" && (
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
