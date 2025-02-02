import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader.tsx";
import { Wishlists } from "../entities/wishlists";
import { fetchWishlists, updateWishlist, removeWishlistItem } from "../services/WishlistService.ts";
import ErrorComponent from "../components/ErrorComponent.tsx";

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<Wishlists[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const user_id = "6796bc4f387b9c8670791537"
  // Chargement des données de la liste des Souhaits
  useEffect(() => {
    const loadWishlists = async () => {
      try {
        setLoading(true);
        setError(null);
        const allwishlists: Wishlists[] = await fetchWishlists(user_id);
        setWishlist(allwishlists);
        setLoading(false);
        setError(null);          
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    loadWishlists();
  }, []);
  
  const removeFromWishlist = async (product_id: string) => {
    if (!wishlist) return;
    const updatedWishlist = await removeWishlistItem(user_id, product_id);
    if (updatedWishlist) {
      setWishlist(wishlist.filter((item) => item.product_id !== product_id));
      alert("Produit retiré de la liste de souhaits !");
    } else {
      alert("Erreur lors de la suppression du produit.");
    }
  };

  if (loading) return <Loader />;
  
  return (
    
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Ma Wishlist</h1>
      {error ? (
        <ErrorComponent message={error} onRetry={() => navigate("/wishlist")}/>
      ) : (
      wishlist.length === 0 ? (
        <div className="text-center">
          
          <p className="text-lg text-gray-600 mb-6">
            Votre liste de souhaits est vide.
          </p>
          <Link
            to="/categories"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Parcourir les produits
          </Link>
      
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.product_id}
              className="bg-white shadow-md rounded-md overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{item.name}</h2>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-blue-600">
                    {item.price_per_unit.toFixed(2)} {item.currency}
                  </span>
                  <button
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    )}
    </div>
  );
};

export default WishlistPage;