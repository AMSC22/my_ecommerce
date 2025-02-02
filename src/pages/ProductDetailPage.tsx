import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button.tsx";
import Tooltip from "../components/TooltipProps.tsx";
import Card from "../components/Card.tsx";
import Loader from "../components/Loader.tsx";
import { Product } from "../entities/Product.tsx";
import { fetchReviews, addReviews } from "../services/ReviewService.ts";
import { Review } from "../entities/Reviews.tsx";
import ErrorComponent from "../components/ErrorComponent.tsx";
import { fetchProductById, addToWishLists, addToCarts } from "../services/ProductService.ts";
import { fetchCategoryById } from "../services/CategoryService.ts";
import { Category } from "../entities/Categories.tsx";

const ProductDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const location = useLocation(); // Récupérer les données transmises par la page Produit
  const [productItems, setProductItems] = useState<Product[]>([]); // Les produits envoyés par la page Produit
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [newReview, setNewReview] = useState<Review>({ user_name: "", rating: 0, comment: "", id: "", product_id: "", product_name: "", created_at: ""});
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<Category>({name: "", id: "", created_by: "", description: "", icon_url: "", is_active: true, is_pending: false});

  const user_id = "6796bc4f387b9c8670791537";
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
        const allProductReview = await fetchReviews(productId || "");
        setReviews(allProductReview);
        
        setLoading(false);
        setError(null);  
      } catch (error: any) {
        setError(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [location]);

  // Données statiques pour tester les produits recommandés
  const products = [
    { id: 1, name: "Smartphone XYZ", currency: "F CFA", description: "Un smartphone puissant avec des fonctionnalités modernes.", price: 699.99, rating: 4.5, stock: 20, images: ["https://via.placeholder.com/300"], category: "Électronique", brand: "XYZ", seller: "John", },
    {
      id: 2,
      name: "Casque Bluetooth ABC",
      description: "Un casque Bluetooth avec une qualité sonore exceptionnelle.",
      price: 59.99,
      rating: 4.8,
      stock: 50,
      currency: "Euro",
      images: ["https://via.placeholder.com/300"],
      category: "Électronique",
      brand: "ABC",
      seller: "John",
    },
    {
      id: 3,
      name: "Tablette DEF",
      description: "Une tablette performante pour le travail et les loisirs.",
      price: 399.99,
      rating: 4.2,
      currency: "USD",
      stock: 15,
      images: ["https://via.placeholder.com/300"],
      category: "Électronique",
      brand: "DEF",
      seller: "John",
    },
  ];

  
  const reviewsPerPage = 2;

  let product = products.find((item) => Number(item.id) === Number(productId));
  if (!product){product = {
    id: 0,
    name: "",
    description: "",
    price: 0,
    rating: 0,
    stock: 0,
    images: [],
    category: "",
    brand: "",
    currency: "",
    seller: "",
  }}

  const filteredReviews = selectedRating
    ? reviews.filter((review) => review.rating === selectedRating)
    : reviews;

  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const handleAddReview = () => {
    if (newReview) {
    if (newReview.user_name && newReview.rating && newReview.comment) {
      
      loadProducts = async () => {
        try {
          setError(null);
          setLoading(true);
          newReview['product_id'] = productId || "";
          newReview['product_name'] = productItems[0]?.name || "";
          const allProductReview = await addReviews([newReview]);
          setReviews([
            ...reviews, allProductReview[0]
          ]);
          setNewReview({ user_name: "", rating: 0, comment: "", id: "", product_id: "", product_name: "", created_at: ""});
          setLoading(false);
          setError(null);        
        } catch (error: any) {
          setError(error.message || "Une erreur est survenue.");
        } finally {
          setLoading(false);
        }
  
      };
      loadProducts();

    } else {
      setError("Veuillez remplir tous les champs pour ajouter un avis.");
    }};
  };

  // Pour ajouter un produit au panier
  const addToCart = (productItems) => {
    const cart = addToCarts(productItems, user_id);   // A modifier
    if (cart["user_id"] === "") {
      setMessage("Vous avez déjà ajouté ce produit à votre panier");
    };
    console.log("Cart = ", cart);
  };

  // Pour ajouter un produit dans sa liste des souhaits
  const addToWishlist = (productItems) => {
    const WishList = addToWishLists(productItems, user_id);   // A modifier
    if (WishList["user_id"] === "") {
      setMessage("Vous avez déjà ajouté ce produit à votre liste de souhaits.");
    };
    console.log("WishList = ", WishList);
  };

  // Pour télécharger les avis dans un fichier CSV
  const exportReviews = () => {
    const csvContent = [
      ["Utilisateur", "Note", "Commentaire"],
      ...reviews.map((review) => [review.user_name, review.rating, review.comment]),
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
            src={productItems[0].images[0]}
            alt={productItems[0].name}
            className="w-full h-auto rounded-md shadow-lg"
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
            Vendeur : <span className="font-semibold"><Link to={`/other-profile/${productItems[0].seller_id}`}>{productItems[0].seller_id}</Link></span>
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
            />
            <Button
              label="Ajouter à la liste de souhaits"
              type="secondary"
              onClick={() => addToWishlist(productItems)}
            />
          </div>
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
        {paginatedReviews.map((review) => (
          <div key={review.id} className="border-b pb-4 mb-4">
            <p className="text-yellow-500">★ {review.rating}</p>
            <p>
              <strong>{review.user_name} :</strong> {review.comment}
            </p>
          </div>
        ))}
        {filteredReviews.length > reviewsPerPage && (
          <div className="flex justify-between items-center mt-4">
            <Button
              label="Précédent"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              type="secondary"
              disabled={currentPage === 1}
            />
            <Button
              label="Suivant"
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, Math.ceil(filteredReviews.length / reviewsPerPage))
                )
              }
              type="secondary"
              disabled={currentPage === Math.ceil(filteredReviews.length / reviewsPerPage)}
            />
          </div>
        )}
        <Button
          label="Exporter les avis"
          onClick={exportReviews}
          className="mt-4 bg-blue-500 text-white px-4 py-2"
        />
      </div>
      )}

      {/* Ajouter un avis */}
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
            value={newReview.user_name}
            onChange={(e) => setNewReview({ ...newReview, user_name: e.target.value })}
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
          {products
            .filter(
              (item) =>
                item.id !== product.id &&
                item.category === product.category &&
                Math.abs(item.price - product.price) < 100
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
