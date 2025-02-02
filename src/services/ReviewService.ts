import apiAxios from "../api/axios.ts";
import { Review } from "../entities/Reviews.tsx";
import { ErreurMessage } from "../utils/ErrorMessage.ts";

const api = apiAxios("http://127.0.0.1:8000/api/v1/");

// Fonction pour récupérer la liste des avis d'un produit
export const fetchReviews = async (product_id: string): Promise<Review[]> => {
  try {
    const { data } = await api.get("product_reviews/product_id/", {params: {product_id: product_id}});
    const ReviewData: Review[] = Object.entries(data).map(([key, value]: [string, any]) => ({
        id: value.id, // ID unique de l'évaluation
        product_name: value.product_name,
        product_id: value.product_id, // ID du produit évalué
        user_name: value.user_name, // Nom de l'utilisateur ayant laissé l'évaluation
        rating: value.rating, // Note sur 5
        comment: value.comment || "", // Commentaire de l'utilisateur
        created_at: value.created_at
    }));
    return ReviewData;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour ajouter un avis
export const addReviews = async (reviews: Review[]): Promise<Review[]> => {
  try {
    console.log("reviews add = ", reviews);
    const dataStore = {
      product_id: reviews[0].product_id,
      product_name: reviews[0].product_name,
      user_name: reviews[0].user_name, 
      rating: reviews[0].rating, 
      comment: reviews[0].comment
    };
    const { data } = await api.post("/product_reviews/", {
      "product_id": dataStore.product_id,
      "product_name": dataStore.product_name,
      "user_name": dataStore.user_name, 
      "rating": dataStore.rating, 
      "comment": dataStore.comment
    });
    return [data];
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour compter tous les avis des produits
export const ReviewCount = async () => {
  try {
    const { data } = await api.get("product_reviews/count/");
    return data;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};
