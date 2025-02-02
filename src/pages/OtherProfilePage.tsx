import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.tsx";

interface Review {
  id: number;
  reviewer: string;
  rating: number;
  comment: string;
  date: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: "buyer" | "seller";
  profileImage: string;
  shopName?: string; // Si c'est un vendeur
  reviews?: Review[]; // Avis reçus pour un vendeur
}

const OtherProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simuler une récupération de données du profil
    setTimeout(() => {
      setProfile({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "0701234567",
        address: "123 Rue de Paris, France",
        role: "seller",
        profileImage: "https://via.placeholder.com/150",
        shopName: "La Boutique de John",
        reviews: [
          { id: 1, reviewer: "Alice Dupont", rating: 5, comment: "Excellent service !", date: "2025-01-10" },
          { id: 2, reviewer: "Jean Martin", rating: 4, comment: "Bonne qualité, mais livraison lente.", date: "2025-01-08" },
          { id: 3, reviewer: "Marie Curie", rating: 3, comment: "Produit correct, mais emballage à revoir.", date: "2025-01-05" },
        ],
      });
    }, 1000);
  }, []);

  if (!profile) {
    return <p>Chargement du profil...</p>;
  }

  // Calcul de la moyenne des notes
  const averageRating = profile.reviews?.length
    ? profile.reviews.reduce((sum, review) => sum + review.rating, 0) / profile.reviews.length
    : 0;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      {/* Header */}
      <header className="text-center mb-6">
        <img
          src={profile.profileImage}
          alt={`${profile.firstName} ${profile.lastName}`}
          className="w-32 h-32 rounded-full mx-auto border mb-4"
        />
        <h1 className="text-3xl font-bold">
          {profile.firstName} {profile.lastName}
        </h1>
        {profile.role === "seller" && profile.shopName && (
          <p className="text-gray-600">{profile.shopName}</p>
        )}
        <p className="text-gray-500">{profile.role === "seller" ? "Vendeur" : "Acheteur"}</p>
      </header>

      {/* Informations générales */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-4">Informations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <strong>Email :</strong> {profile.email}
          </p>
          <p>
            <strong>Téléphone :</strong> {profile.phone}
          </p>
          <p>
            <strong>Adresse :</strong> {profile.address}
          </p>
        </div>
      </section>

      {/* Section Avis des clients (uniquement pour les vendeurs) */}
      {profile.role === "seller" && profile.reviews && (
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4">Avis des clients</h2>

          {/* Moyenne des notes */}
          <div className="mb-6 flex items-center gap-4">
            <p className="text-2xl font-bold">
              Note moyenne : {averageRating.toFixed(1)} / 5
            </p>
            <div className="flex items-center justify-between mt-2">
                <span className="text-yellow-500 font-semibold">
                {Array.from({ length: Math.round(averageRating) }, (_, i) => "⭐").join("")}
                </span>
                <span className="text-gray-500 text-sm">
                {averageRating.toFixed(1)} étoiles
                </span>
            </div>
            <p className="text-gray-500">({profile.reviews.length} avis)</p>
          </div>

          {/* Liste des avis */}
          <div className="space-y-4">
            {profile.reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gray-50 rounded-md shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-bold">{review.reviewer}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-yellow-500 font-semibold">
                    {Array.from({ length: Math.round(review.rating) }, (_, i) => "⭐").join("")}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {review.rating.toFixed(1)} étoiles
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bouton de contact */}
      <footer className="text-center mt-6">
        <Button
          label={`Contacter ${profile.firstName}`}
          onClick={() => navigate(`/messaging?user=${profile.email}`)} // Exemple : Redirection vers une page de messagerie
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        />
      </footer>
    </div>
  );
};

export default OtherProfilePage;