import apiAxios from "../api/axios.ts";
import { Review } from "../entities/Reviews.tsx";
import { ErreurMessage } from "../utils/ErrorMessage.ts";
import { fetchUser } from "./UserService.ts";
import { fetchProductId } from "./ProductService.ts";

const api = apiAxios("/api/v1/");

// Fonction pour récupérer la liste de tous les avis
export const fetchAllReviews = async (): Promise<Review[]> => {
  try {
    const { data } = await api.get("product_reviews/");
    const querry_user: string[] = Object.entries(data).map(([key, value]: [any, any]) => value.user_id );
    const users: any = await fetchUser(querry_user);
    const querry_product: string[] = Object.entries(data).map(([key, value]: [any, any]) => value.product_id );
    const products: any = await fetchProductId(querry_product);
    const dataReviews = data.map((review: any) => {
      const user = users[0].find((u: any) => u ? u.id === review.user_id: undefined);  // Assure la correspondance
      const product = products[0].find((u: any) => u ? u.id === review.product_id: undefined);  // Assure la correspondance
      return { ...review, user_id: user ? user.first_name + " " + user.last_name: "Utilisateur inconnu", 
        product_id: product ? product.id: "Produit inconnu", 
        product_name: product ? product.name: "Produit inconnu" };
    });
    return dataReviews;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour récupérer la liste des avis d'un produit
export const fetchReviews = async (product_id: string, statut: boolean = false): Promise<Review[]> => {
  try {
    const { data } = await api.get("product_reviews/product_id/", {params: {product_id: product_id, statut: statut}});
    const ReviewData: Review[] = Object.entries(data).map((value: any) => ({
        id: value.id, // ID unique de l'évaluation
        product_name: value.product_name,
        product_id: value.product_id, // ID du produit évalué
        user_id: value.user_name, // Nom de l'utilisateur ayant laissé l'évaluation
        rating: value.rating, // Note sur 5
        comment: value.comment || "", // Commentaire de l'utilisateur
        statut: value.statut,
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
    const dataStore = {
      product_id: reviews[0].product_id,
      product_name: reviews[0].product_name,
      user_id: reviews[0].user_id, 
      rating: reviews[0].rating, 
      comment: reviews[0].comment,
      status: reviews[0].statut,
    };
    const { data } = await api.post("/product_reviews/", {
      "product_id": dataStore.product_id,
      "product_name": dataStore.product_name,
      "user_id": dataStore.user_id, 
      "rating": dataStore.rating, 
      "comment": dataStore.comment,
      "status": dataStore.status,
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

// Fonction pour compter tous les avis des produits d'un vendeur
export const sellerReviewCount = async (products: any[]) => {
  try {
    const querry = products.map((product) => product.id)
    const { data } = await api.post("product_reviews/product_rating/", { "product_ids": querry });
    const rating = Object.entries(data.ratings).map((value: any) => value[1]["average_rating"]);
    const reviews = Object.entries(data.ratings).map((value: any) => value[1]["total_reviews"]);
    let total_reviews = 0, average_rating = 0;
    for (let index = 0; index < rating.length; index++) {
      average_rating += rating[index];
      total_reviews += reviews[index]; 
    }
    if(total_reviews === 0) { return average_rating }
    else return average_rating/total_reviews

  } catch (error) {
    ErreurMessage(error);
    return 0;
  }
};

// Fonction pour modifier un élément d'un avis
export const UpdateReview = async (review_id: string, review: Review) => {
  try {
    const { data } = await api.put(`product_reviews/${review_id}`, review);
    return data;
  } catch (error) {
    ErreurMessage(error);
    return null;
  }
};

// Fonction pour supprimer un avis
export const DeleteReview = async (review_id: string) => {
  try {
    const { data } = await api.delete(`product_reviews/${review_id}`);
    return data;
  } catch (error) {
    ErreurMessage(error);
    return null;
  }
};