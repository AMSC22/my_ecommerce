import apiAxios from "../api/axios.ts";
import { ErreurMessage } from "../utils/ErrorMessage.ts";
import { Wishlists } from "../entities/wishlists.tsx";

const api = apiAxios("http://127.0.0.1:8000/api/v1/");

// Récupérer la liste des souhaits d'un utilisateur
export const fetchWishlists = async (user_id: string): Promise<Wishlists[]> => {
  try {
    const { data } = await api.get(`wishlists/user_id/?user_id=${user_id}`);
    const ProductWishlist: Wishlists[] = Object.entries(data[0].items).map(([key, value]: [string, any]) => ({
        product_id: value.product_id,
        name: value.name,
        image: value.image,
        description: value.description,
        currency: value.currency,
        price_per_unit: value.price_per_unit,
        total_price: value.total_price,
        }));
    console.log("ProductWishlist = ", ProductWishlist);
    return ProductWishlist;
  } catch (error: any) {
    ErreurMessage(error);
    return [];
  }
};

// Mettre à jour le Panier complet avant validation.
export const updateFullWishlist = async (updatedWishlist: Wishlists) => {
  try {
    const { data } = await api.put(`wishlists/update_all/`, {updatedWishlist});
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return null;
  }
};

// Compte le nombre de produits présents dans le Panier.
export const countWishlist = async (user_ids: string[]) => {
  try {
    const { data } = await api.get(`wishlists/count/?user_ids=${user_ids}`);
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return null;
  }
};

// Mettre à jour le Panier complet avant validation.
export const updateWishlist = async (user_id: string, wishlist: Wishlists[]) => {
  try {
    const { data } = await api.put(`wishlists/${user_id}/product`, wishlist);
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return null;
  }
};

// Suppimer un produit dans la liste des souhaits.
export const removeWishlistItem = async (user_id: string, product_id: string) => {
  try {
    const { data } = await api.delete(`wishlists/${user_id}/${product_id}/`);
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return null;
  }
};
