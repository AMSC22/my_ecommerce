import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.tsx";

interface FavoriteItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: 1,
      name: "Smartphone XYZ",
      description: "Un smartphone performant et élégant.",
      image: "https://via.placeholder.com/150",
      price: 799.99,
    },
    {
      id: 2,
      name: "Casque Bluetooth ABC",
      description: "Un casque avec un son clair et immersif.",
      image: "https://via.placeholder.com/150",
      price: 59.99,
    },
  ]);

  const removeFromFavorites = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Mes Favoris</h1>
        {favorites.length === 0 && (
          <p className="text-gray-600 text-center mt-2">
            Aucun produit n'a été ajouté à vos favoris.
          </p>
        )}
      </header>

      {favorites.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <div key={item.id} className="bg-white shadow-md rounded-md p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600 text-sm mb-4">{item.description}</p>
              <p className="text-blue-600 font-bold mb-4">
                {item.price.toFixed(2)} €
              </p>
              <div className="flex justify-between items-center">
                <Link
                  to={`/products/${item.id}`}
                  className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Voir
                </Link>
                <Button
                  label="Retirer"
                  onClick={() => removeFromFavorites(item.id)}
                  type="danger"
                  className="px-4 py-2"
                />
              </div>
            </div>
          ))}
        </section>
      )}

      {favorites.length === 0 && (
        <div className="text-center mt-8">
          <Link
            to="/categories"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
          >
            Parcourir les catégories
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
