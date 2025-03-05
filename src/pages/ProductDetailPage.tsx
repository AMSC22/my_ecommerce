import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import Button from "../components/Button.tsx";
import Tooltip from "../components/TooltipProps.tsx";
import Card from "../components/Card.tsx";
import Loader from "../components/Loader.tsx";
import { Product } from "../entities/Product.tsx";
import { fetchReviews, addReviews } from "../services/ReviewService.ts";
import { Review } from "../entities/Reviews.tsx";
import ErrorComponent from "../components/ErrorComponent.tsx";
import { fetchvalidatedProducts, fetchProductById, addToWishLists, addToCarts } from "../services/ProductService.ts";
import { fetchCategoryById } from "../services/CategoryService.ts";
import { Category } from "../entities/Categories.tsx";
import { fetchOrders } from "../services/OrderService.ts";
import { OderData } from "../entities/Orders.tsx";
import { fetchUser } from "../services/UserService.ts";
import { fetchCarts } from "../services/CartService.ts";

const ProductDetailsPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const location = useLocation(); // Récupérer les données transmises par la page Produit
  const [productItems, setProductItems] = useState<Product[]>([]); // Les produits envoyés par la page Produit
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [newReview, setNewReview] = useState<Review>({ statut: false, user_id: "", rating: 0, comment: "", id: "", product_id: "", product_name: "", created_at: ""});
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<Category>({name: "", id: "", created_by: "", description: "", icon_url: "", is_active: true, is_pending: false});
  const [uniqueCat, setUniqueCat] = useState<string[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>();
  const [userReviews, setUserReviews] = useState<any[]>([]);
  const user_id = localStorage.getItem("user_id") || "";

  const imageLink = "/images/";
  // Récupérer les données transmises par la page panier
  let loadProducts: any;
  useEffect(() => {
    loadProducts = async () => {
      try {
        setError(null);
        setLoading(true);
        
        // Pour collecter le donnéees du produit
        const allProduct = await fetchProductById(productId || "");
        setProductItems(allProduct);
        
        // Pour collecter le donnéees de la catégories du produit
        const category = await fetchCategoryById(allProduct[0].category_id);
        setCategory(category);

        // Pour collecter les avis sur le produit
        const allProductReview = await fetchReviews(productId || "", true);
        setReviews(allProductReview);
        
        // Pour collecter le nom du vendeur du produit
        const user = await fetchUser([allProduct[0].seller_id]);
        setUser(user[0]);

        // Extraire les user_id
        const userIds = allProductReview.flatMap(review => review.user_id);

        // Supprimer les doublons avec Set
        const uniqueUserIds: any[] = [...new Set(userIds)];
        
        const userReview = await fetchUser(uniqueUserIds);
        
        // Fusionner toutes les listes de products
        setUserReviews(userReview.flat());

        // Pour collecter le nom des clients ayant donné leur avis sur produit
        const users = await fetchUser([allProduct[0].seller_id]);
        console.log("user = ", user[0]);
        setUser(user[0]);

        setLoading(false);
        setError(null);  
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    if(productId) loadProducts();
  }, [productId]);

  useEffect(() => {
    if (!user_id) {
      setError("Utilisateur non connecté !");
      setLoading(false);
      return;
    }

    const loadSales = async () => {
      try {
        setLoading(true);
        setError(null);
        const totalSale: OderData[] = await fetchOrders(["buyer", user_id], "");
        // Extraire les category_id
        const categoryIds = totalSale.flatMap(product => product.category_ids);

        // Supprimer les doublons avec Set
        const uniqueCategoryIds: any[] = [...new Set(categoryIds)];
        setUniqueCat(uniqueCategoryIds);
        
        setLoading(false);
        setError(null);          
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    loadSales();

  }, [user_id]);

  useEffect(() => {
    const loadRecommandedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // Collecte les produits du panier de l'acheteur
        const cartId = await fetchCarts(user_id);
        const productIds = cartId.flatMap(product => product.product_id);
        const UniqueCat = [...uniqueCat, ...productIds];
        const productPromises = UniqueCat.map((categoryId) => fetchvalidatedProducts(categoryId));
        const recommandedProductArray = await Promise.all(productPromises);
        // Fusionner toutes les listes de products
        setRecommendedProducts(recommandedProductArray.flat());
        setLoading(false);
        setError(null);          
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    if (uniqueCat.length > 0) loadRecommandedProducts();

  }, [uniqueCat]);

  const handleAddReview = async () => {
    if (newReview) {
    if (!newReview.user_id && !newReview.rating && !newReview.comment) {
      setError("Veuillez remplir tous les champs pour ajouter un avis");
      return;
    }
      
    try {
      setError(null);
      setLoading(true);
      newReview['user_id'] = user_id || "";
      newReview['product_id'] = productId || "";
      newReview['product_name'] = productItems[0]?.name || "";
      const allProductReview = await addReviews([newReview]);
      setReviews([
        ...reviews, allProductReview[0]
      ]);
      setNewReview({ statut: false, user_id: "", rating: 0, comment: "", id: "", product_id: "", product_name: "", created_at: ""});
      setLoading(false);
      setError(null);        
    } catch (error: any) {
      setError(error.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
    };
  };

  // Pour ajouter un produit au panier
  const addToCart = (productItems) => {
    try {
      const cart = addToCarts(productItems, user_id);   // A modifier
      localStorage.setItem("cart-update", Date.now().toString());  // Mets à jour le cache
      if (cart && cart["user_id"] === "") {
        setMessage("Vous avez déjà ajouté ce produit à votre panier");
      };
    } catch (error) {
      setError("Erreur lors de l'ajout au panier.");
    }
  };

  // Pour ajouter un produit dans sa liste des souhaits
  const addToWishlist = (productItems) => {
    try {
      const cart = addToWishLists(productItems, user_id);   // A modifier
      localStorage.setItem("wishlist-update", Date.now().toString());  // Mets à jour le cache
      if (cart && cart["user_id"] === "") {
        setMessage("Vous avez déjà ajouté ce produit à votre liste de souhaits.");
      };
    } catch (error) {
      setError("Erreur lors de l'ajout à la liste de souhaits.");
    }
  };

  // Pour télécharger les avis dans un fichier CSV
  const exportReviews = () => {
    const csvContent = [
      ["Utilisateur", "Note", "Commentaire"],
      ...reviews.map((review) => [review.user_id, review.rating, review.comment]),
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

  if (loading) return <Loader />;

  if (error) {
    return (
      <ErrorComponent message={error} onRetry={() => location}/>
    );
  }
  
  const reviewsPerPage = 2;

  const filteredReviews = selectedRating
    ? reviews.filter((review) => review.rating === selectedRating)
    : reviews;

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  if (!productItems) {
    return (
      <div className="text-center mt-20 py-40">
        <div className="text-blue-500 text-5xl mb-4">📦</div>
        <h1 className="text-2xl font-bold">Produit non trouvé</h1>
        <p>Nous n'avons pas pu trouver le produit que vous cherchez.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image du produit */}
        <div>
          <img
            src={imageLink + productItems[0].images[0]}
            alt={productItems[0].name}
            className="w-full h-80 rounded-md shadow-lg"
          />
        </div>

        {/* Informations du produit */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{productItems[0].name}</h1>
          <p className="text-gray-600 mb-4">{productItems[0].description}</p>
          <p className="text-xl font-semibold text-blue-600 mb-2">
            Prix : {productItems[0].price} {productItems[0].currency}
          </p>
          <p className="text-sm text-gray-500">
            Catégorie : <span className="font-semibold">{category.name}</span>
          </p>
          <p className="text-sm text-gray-500">
            Marque : <span className="font-semibold">{productItems[0].brand}</span>
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Vendeur : <span className="font-semibold"><Link to={`/other-profile/${productItems[0].seller_id}`}>{user?.first_name + " " + user?.last_name}</Link></span>
          </p>

          {/* Stock et Évaluation */}
          <div className="flex items-center gap-4 mb-4">
            <Tooltip
              message={`Ce produit a une note moyenne de ${productItems[0].rating.toFixed(2)} étoiles`}
              position="top"
            >
              <span className="text-yellow-500 text-lg">★ {productItems[0].rating.toFixed(2)}</span>
            </Tooltip>
            {productItems[0].quantity > 0 ? (
              <span className="text-green-600 font-semibold">
                En stock ({productItems[0].status} disponibles )
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Rupture de stock</span>
            )}
          </div>

          {message ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              {message}
            </div>
          ) : (undefined)}
          {/* Boutons */}
          <div className="flex gap-4">
            <Button
              label="Ajouter au panier"
              type="primary"
              onClick={() => addToCart(productItems)}
              disabled={productItems[0].quantity <= 0}
            />
            <Button
              label="Ajouter à la liste de souhaits"
              type="secondary"
              onClick={() => addToWishlist(productItems)}
            />
          </div>
        </div>
      </div>

      {/* Section des photos du produit avec défilement horizontal */}
      <div className="overflow-auto whitespace-nowrap py-4">
        <div className="flex gap-4">
          {productItems[0].images.map((image, index) => (
            <img 
            key={index} 
            src={imageLink + image} 
            alt={`Photo ${index + 1} du produit`}
            className="h-48 rounded-md" />
          ))}
        </div>
      </div>

      {/* Section Avis */}
      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <ErrorComponent message={error} />
        </div>
      ) : (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Avis des utilisateurs</h2>
        <div className="overflow-auto">
          <div className="flex gap-4 mb-4">
            <Button
              label="Tous les avis"
              onClick={() => setSelectedRating(0)}
              type={selectedRating === 0 ? "primary" : "secondary"}
            />
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                label={`${rating} étoiles`}
                onClick={() => setSelectedRating(rating)}
                type={selectedRating === rating ? "primary" : "secondary"}
              />
            ))}
          </div>
          {paginatedReviews.length !== 0 ? (paginatedReviews.map((review, index) => (
            <div key={review.id} className="border-b pb-4 mb-4">
              <p className="text-yellow-500">★ {review.rating}</p>
              <p>
                <strong>{userReviews[index]?.first_name + " " + userReviews[index]?.last_name} :</strong> {review.comment}
              </p>
            </div>
          ))):(      <div className="text-center mt-20 py-40">
            <h1 className="text-2xl font-bold">Aucun avis trouvé</h1>
            <p>Nous n'avons aucun avis pour ce produit.</p>
          </div>)}
          {filteredReviews.length > reviewsPerPage && (
            <div className="flex justify-between items-center mt-4">
              <Button
                label="Précédent"
                onClick={prevPage}
                type="secondary"
                disabled={currentPage === 1}
              />
              <span>Page {currentPage} sur {totalPages}</span>
              <Button
                label="Suivant"
                onClick={nextPage}
                type="secondary"
                disabled={currentPage === totalPages}
              />
            </div>
          )}
        </div>
        <Button
          label="Exporter les avis"
          onClick={exportReviews}
          className="mt-4 bg-blue-500 text-white px-4 py-2"
        />
      </div>
      )}

      {/* Ajouter un avis */}
      {}
      {error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          <ErrorComponent message={error} />
        </div>
      ) : (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Ajouter un avis</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Votre nom"
            value={newReview.user_id}
            onChange={(e) => setNewReview({ ...newReview, user_id: e.target.value })}
            className="border rounded-md p-2"
          />
          <select
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
            className="border rounded-md p-2"
          >
            <option value={0}>Sélectionnez une note</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} étoiles
              </option>
            ))}
          </select>
          <textarea
            placeholder="Votre commentaire"
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="border rounded-md p-2"
          ></textarea>
          <Button label="Ajouter l'avis" onClick={handleAddReview} />
        </div>
      </div>
      )}

      {/* Section Produits Recommandés */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Produits recommandés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendedProducts
            .filter(
              (item) =>
                item.id !== productItems[0].id
            )
            .map((recommendedProduct) => (
              <Card
                key={recommendedProduct.id}
                title={recommendedProduct.name}
                description={`Prix : ${recommendedProduct.price} €`}
                image={recommendedProduct.images[0]}
                link={`/products/${recommendedProduct.id}`}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
