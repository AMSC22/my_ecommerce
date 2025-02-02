import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      {/* Image illustrative */}
      <div className="mb-6">
        <img
          src="https://via.placeholder.com/400x300?text=404+Not+Found" // Remplacez par une image plus adaptée
          alt="404 Not Found"
          className="max-w-full h-auto"
        />
      </div>

      {/* Texte principal */}
      <h1 className="text-4xl font-bold mb-4">404 - Page Introuvable</h1>
      <p className="text-lg text-gray-600 mb-6">
        Oups ! La page que vous cherchez n'existe pas ou a été déplacée.
      </p>

      {/* Bouton pour revenir à l'accueil */}
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;