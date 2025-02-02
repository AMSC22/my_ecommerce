import React, { useState, useEffect } from "react";
import Button from "../../components/Button.tsx";

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  productName: string;
}

const SellerReviewPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    // Simulation de données d'avis
    const fetchReviews = async () => {
      const mockReviews: Review[] = [
        {
          id: 1,
          customerName: "Alice Dupont",
          rating: 5,
          comment: "Produit incroyable ! Je suis très satisfaite.",
          date: "2025-01-10",
          productName: "Smartphone XYZ",
        },
        {
          id: 2,
          customerName: "Jean Martin",
          rating: 4,
          comment: "Bon produit, mais la livraison était un peu lente.",
          date: "2025-01-09",
          productName: "Casque Bluetooth ABC",
        },
        {
          id: 3,
          customerName: "Marie Curie",
          rating: 3,
          comment: "Le produit est correct, mais la qualité pourrait être meilleure.",
          date: "2025-01-08",
          productName: "Pantalon en jean",
        },
        // Ajoutez d'autres avis ici...
      ];

      setReviews(mockReviews);

      // Calculer la note moyenne
      const totalRating = mockReviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = mockReviews.length > 0 ? totalRating / mockReviews.length : 0;
      setAverageRating(parseFloat(avgRating.toFixed(1)));
    };

    fetchReviews();
  }, []);

  // Filtrage par note
  const filteredReviews = filterRating
    ? reviews.filter((review) => review.rating === filterRating)
    : reviews;

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const displayedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Avis des clients</h1>
        <p className="text-gray-600">Consultez et analysez les avis laissés sur vos produits.</p>
      </header>

      {/* Statistiques globales */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">Statistiques générales</h2>
        <div className="flex gap-6">
          <div className="bg-blue-100 text-blue-700 p-4 rounded-md shadow-md flex-1">
            <h3 className="text-lg font-semibold">Note moyenne</h3>
            <p className="text-2xl font-bold">{averageRating} / 5</p>
          </div>
          <div className="bg-green-100 text-green-700 p-4 rounded-md shadow-md flex-1">
            <h3 className="text-lg font-semibold">Total d'avis</h3>
            <p className="text-2xl font-bold">{reviews.length}</p>
          </div>
        </div>
      </section>

      {/* Filtrage des avis */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">Filtrer par note</h2>
        <div className="flex gap-4">
          <Button
            label="Tous"
            onClick={() => setFilterRating(null)}
            className={`px-4 py-2 rounded ${
              filterRating === null ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          />
          {[5, 4, 3, 2, 1].map((rating) => (
            <Button
              key={rating}
              label={`${rating} ★`}
              onClick={() => setFilterRating(rating)}
              className={`px-4 py-2 rounded ${
                filterRating === rating ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Liste des avis */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Liste des avis</h2>
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review) => (
            <div key={review.id} className="border-b pb-4 mb-4">
              <h3 className="text-lg font-bold">{review.productName}</h3>
              <p className="text-sm text-gray-500">
                {review.customerName} | {review.date}
              </p>
              <p className="text-yellow-500 text-lg">★ {review.rating}</p>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Aucun avis trouvé pour le moment.</p>
        )}
      </section>

      {/* Pagination */}
      <section className="flex justify-center items-center gap-4">
        <Button
          label="Précédent"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        />
        <p>
          Page {currentPage} sur {totalPages}
        </p>
        <Button
          label="Suivant"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        />
      </section>
    </div>
  );
};

export default SellerReviewPage;