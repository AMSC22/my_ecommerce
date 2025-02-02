import apiAxios from "../api/axios.ts";
import { ErreurMessage } from "../utils/ErrorMessage.ts";
import { Carts } from "../entities/Carts.tsx";

const api = apiAxios("http://127.0.0.1:8000/api/v1/");

// Récupérer le Panier d'un utilisateur
export const fetchCarts = async (user_id: string): Promise<Carts[]> => {
  try {
    const { data } = await api.get(`carts/user_id/?user_id=${user_id}`);
    const ProductCart: Carts[] = Object.entries(data[0].items).map(([key, value]: [string, any]) => ({
        product_id: value.product_id,
        quantity: value.quantity,
        name: value.name,
        image: value.image,
        currency: value.currency,
        unity: value.unity || "",  // Représente l'unité de mésure comme le Kg, g, etc..
        price_per_unit: value.price_per_unit,
        total_price: value.total_price,
        }));
    return ProductCart;
  } catch (error: any) {
    ErreurMessage(error);
    return [];
  }
};

// Mettre à jour le Panier complet avant validation.
export const updateFullCart = async (updatedCart: Carts) => {
  try {
    const { data } = await api.put(`carts/update_all/`, {updatedCart});
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return null;
  }
};

// Mettre à jour le Panier complet avant validation.
export const updateCart = async (user_id: string, cart: Carts[]) => {
  try {
    const { data } = await api.put(`carts/${user_id}/product`, cart);
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return null;
  }
};

// Compte le nombre de produits présents dans le Panier.
export const countCart = async (user_ids: string[]) => {
  try {
    const { data } = await api.get(`carts/count/?user_ids=${user_ids}`);
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return null;
  }
};

// Suppimer un produit dans le Panier.
export const removeCartItem = async (user_id: string, product_id: string) => {
  try {
    const { data } = await api.delete(`carts/${user_id}/${product_id}/`);
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return null;
  }
};
