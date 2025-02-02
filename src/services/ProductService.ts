import apiAxios from "../api/axios.ts";
import { Product } from "../entities/Product.tsx";
import { ErreurMessage } from "../utils/ErrorMessage.ts";

const api = apiAxios("http://127.0.0.1:8000/api/v1/");

// Fonction pour organiser et filtrer les catégories
export const processProducts = (products: Product[]) => {
    const validatedProducts: Product[] = [];
    const unvalidatedProducts: Product[] = [];
    const pendingProducts: Product[] = [];
    const inactiveProducts: Product[] = [];
  
    products.forEach((product) => {
      if (product.is_active && !product.is_pending) {
        validatedProducts.push(product);
      } else if (!product.is_active && product.is_pending) {
        pendingProducts.push(product);
      } else if (!product.is_active && !product.is_pending) {
        inactiveProducts.push(product);
      } else {
        unvalidatedProducts.push(product);
      }
    });
  
    return {
      validatedProducts,
      unvalidatedProducts,
      pendingProducts,
      inactiveProducts,
    };
};

// Fonction pour récupérer la liste des produits en attente de validité
export const fetchallPendingProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await api.get("products/");
    const { pendingProducts } = await processProducts(data)
    return pendingProducts;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour récupérer la liste des produits en attente de validité
export const fetchallInactiveProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await api.get("products/");
    const { inactiveProducts } = await processProducts(data)
    return inactiveProducts;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour récupérer la liste des produits d'une catégorie pour etre validés par l'admin
export const fetchProducts = async (category_id: string): Promise<Product[]> => {
  try {
    const { data } = await api.get("products/category_id/", {params: {category_id: category_id}});
    return data;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour récupérer la liste des produits validés d'une catégorie
export const fetchvalidatedProducts = async (category_id): Promise<Product[]> => {
    const { validatedProducts } = await processProducts(await fetchProducts(category_id));
      return validatedProducts;
};

// Fonction pour récupérer la liste des produits non validés d'une catégorie
export const fetchunvalidatedProducts = async (category_id): Promise<Product[]> => {
    const { unvalidatedProducts } = await processProducts(await fetchProducts(category_id));
      return unvalidatedProducts;
};

// Fonction pour récupérer la liste des produits en attente d'une catégorie pour etre affichés aux acheteurs
export const fetchpendingProducts = async (category_id): Promise<Product[]> => {
    const { pendingProducts } = await processProducts(await fetchProducts(category_id));
      return pendingProducts;
};

// Fonction pour récupérer la liste des produits inactifs d'une catégorie
export const fetchinactiveProducts = async (category_id): Promise<Product[]> => {
    const { inactiveProducts } = await processProducts(await fetchProducts(category_id));
      return inactiveProducts;
};

// Fonction pour récupérer calculer le nombre de produits validés d'une catégorie
export const fetchProductStats = async (products: Product[]): Promise<Product[]> => {
  try {
    const query = products.map((product) => product.id);
    const { data } = await api.post("product_reviews/product_rating/", {product_ids: query});
    const ProductData: Product[] = Object.entries(products).map(([key, value]: [string, Product]) => ({
      id: value.id,
      seller_id: value.seller_id,
      name: value.name,
      description: value.description,
      price: value.price,
      currency: value.currency,
      quantity: value.quantity,
      category_id: value.category_id,
      images: value.images,
      brand: value.brand,
      dimensions: value.dimensions || "", // Dimensions du produit (e.g., 10x15x20 cm)"
      weight: value.weight || "", // Poids du produit (e.g., 1.5 kg)
      is_active: value.is_active, // actif ou désactivé
      is_pending: value.is_pending, // En attente ou validé
      validated_by_admin: value.validated_by_admin, // Id de l'administrateur ayant validé le produit
      status: value.status, // Statut du produit (e.g., available, out_of_stock)
      rating: data.ratings[value.id]["average_rating"], // Evalution ou nombre d'étoile
      created_at: value.created_at,
    }));
    return ProductData
  } catch (error) {
    ErreurMessage(error);
    return products;
  }
};

// Récupérer un produit par son Id
export const fetchProductById = async (product_id: string): Promise<Product[]> => {
  try {
    const { data } = await api.get(`products/${product_id}`);
    console.log("data = ", data);
    const data2 = await api.post("product_reviews/product_rating/", {product_ids: [product_id]});
    data.rating = data2.data.ratings[product_id]["average_rating"];
    return [data];
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Ajouter un produit au Panier
export const addToCarts = async (products: Product, user_id: string): Promise<Product[]> => {
  try {
    const { data } = await api.post("carts/", {
      "user_id": user_id,
      "items": [{
        "product_id": products[0].id,
        "name": products[0].name,
        "image": products[0].images[0],
        "currency": products[0].currency,
        "quantity": 1,
        "price_per_unit": products[0].price,
        "total_price": products[0].price,
      }],
      "total_price": products[0].price
    });
    return data;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Ajouter un produit à la liste des souhaits
export const addToWishLists = async (products: Product, user_id: string): Promise<Product[]> => {
  try {
    const { data } = await api.post("wishlists/", {
      "user_id": user_id,
      "items": [{
        "product_id": products[0].id,
        "description": products[0].name,
        "name": products[0].name,
        "currency": products[0].currency,
        "image": products[0].images[0],
        "price_per_unit": products[0].price,
        "added_at": "2025-01-26T23:00:35.165+00:00",
      }],
    });
    return data;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour modifier les données d'un produit
export const UpdateProduct = async (product_id: string, product_data: any) => {
  try {
    const { data } = await api.put(`products/${product_id}`, product_data);
    return data;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour supprimer un produit
export const DeleteProduct = async (product_id: string) => {
  try {
    const { data } = await api.delete(`products/${product_id}`);
    return data;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour compter tous les produits
export const ProductCount = async () => {
  try {
    const { data } = await api.get(`products/count/`);
    return data;
  } catch (error) {
    ErreurMessage(error);
    return [];
  }
};