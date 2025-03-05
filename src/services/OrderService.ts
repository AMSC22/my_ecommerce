import apiAxios from "../api/axios.ts";
import { ErreurMessage } from "../utils/ErrorMessage.ts";
import { Order, OderData } from "../entities/Orders.tsx";
import { fetchUser } from "./UserService.ts";
import { Users } from "../entities/Users.tsx";
import { fetchProductId } from "./ProductService.ts";
import { convertData } from "../utils/convertion.ts";
import { Product } from "../entities/Product.tsx";

const api = apiAxios("/api/v1/");

// Fonction pour récupérer la liste des commandes payées d'un vendeur
export const fetchOrders = async (seller_id: string[] = [], status: string = ""): Promise<OderData[]> => {
  try {
    const { data } = await api.post(`orders/seller_id/?status=${status}`, { seller_id });
    const querry_user: string[] = Object.entries(data).map(([key, value]: [string, any]) => value.buyer_id);
    let querry_product: string[] = [];
    let count = 0;
    Object.entries(data).map(([key, value]: [string, any]) => value.items.map((value1: any) => 
      (querry_product[count] = value1.product_id,
      count += 1)));
    const users: any = await fetchUser(querry_user);
    const product: any = await fetchProductId(querry_product);
    count = 0;
    let orderData: OderData[] = [];
    Object.entries(data).map(([key, value]: [any, any]) => value.items.map((value1: any) => (
      orderData[count] = {
          id: count, // ID de la commande
          buyer: users[0][key]?.first_name ? users[0][key]?.first_name + " " + users[0][key]?.last_name : users[0].first_name + " " + users[0].last_name, // ID de l'utilisateur ayant passé la commande
          seller_name: value.seller_id, // ID du vendeur
          productName: product[0][count].name, // Nom des articles dans la commande (avec quantités et prix)
          price: product[0][count].price, // value.total_price,             // Prix total de la commande
          currency: product[0][count].currency, // Devise utilisée pour la commande
          quantity: value1.quantity,
          image: product[0][count].images[0],
          buyer_id: value.buyer_id,
          status: value.status, // Statut de la commande (pending, paid, shipped, delivered, canceled)
          date: value.created_at, // Date de création de la commande
          category_ids: product[0][count++].category_id,
      }),
    ));
    return orderData;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour récupérer la liste des commandes payées d'un vendeur
export const fetchAdminOrders = async (): Promise<any[]> => {
  try {
    const { data } = await api.get(`/orders/`);
    console.log("data = ", data);
    const querry_user: string[] = Object.entries(data).map(([key, value]: [string, any]) => value.buyer_id || value.user_id );
    let querry_product: string[] = [];
    let count = 0;
    Object.entries(data).map(([key, value]: [string, any]) => value.items.map((value1: any) => 
      (querry_product[count] = value1.product_id,
      count += 1)));
    const users: any = await fetchUser(querry_user);
    const products: Product[] = await fetchProductId(querry_product);
    const product: any = products[0];
    const produits = (product_id: string) => {
      let index = 0;
      while (true) {
        if (product[0][index].id === product_id) {
          return [product[0][index].name, product[0][index].price, product[0][index].currency];
        }
        index++;
      }
    };
    count = 0;
    const orderData: any[] =  Object.entries(data).map(([key, value]: [string, any]) => ({
      id: count++, // ID de la commande
      customerName: users[0][key]?.first_name ? users[0][key]?.first_name + " " + users[0][key]?.last_name : users[0].first_name + " " + users[0].last_name, // ID de l'utilisateur ayant passé la commande
      items: value.items.map((value1: {product_id: string, quantity: number}) => ({
        productName: produits(value1.product_id)[0], 
        quantity: value1.quantity, 
        price: produits(value1.product_id)[1], 
        currency: produits(value1.product_id)[2],
      })),
      total: 819.97,
      status: convertData(value.status),
      orderDate: value.created_at.split("T")[0],
    }));
    console.log("orderData = ", orderData);
    return orderData;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour compter toutes les commandes (en attente, validées, etc..) d'un utilisateur
export const OrderCount = async (seller_id: string[] = [], status: string = "") => {
  try {
    const { data } = await api.post(`orders/count/?status=${status}`, { seller_id });
    return data;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};
