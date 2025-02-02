import apiAxios from "../api/axios.ts";
import { ErreurMessage } from "../utils/ErrorMessage.ts";
import { Category } from "../entities/Categories.tsx";

const api = apiAxios("http://127.0.0.1:8000/api/v1/");

// Fonction pour organiser et filtrer les catégories
export const processCategories = (categories: Category[]) => {
    const validatedCategories: Category[] = [];
    const unvalidatedCategories: Category[] = [];
    const pendingCategories: Category[] = [];
    const inactiveCategories: Category[] = [];
  
    categories.forEach((category) => {
      if (category.is_active && !category.is_pending) {
        validatedCategories.push(category);
      } else if (!category.is_active && category.is_pending) {
        pendingCategories.push(category);
      } else if (!category.is_active && !category.is_pending) {
        inactiveCategories.push(category);
      } else {
        unvalidatedCategories.push(category);
      }
    });
  
    return {
      validatedCategories,
      unvalidatedCategories,
      pendingCategories,
      inactiveCategories,
    };
};

// Fonction pour récupérer toutes les catégories 
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data } = await api.get("categories/");
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return [];
  }
};

// Fonction pour récupérer une catégorie par son id 
export const fetchCategoryById = async (category_id) => {
  try {
    const { data } = await api.get(`categories/${category_id}`);
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return {};
  }
};

// Fonction pour filtrer les catégories validées
export const fetchvalidatedCategories = async (): Promise<Category[]> => {
    const { validatedCategories } = await processCategories(await fetchCategories());
      return validatedCategories;
};

// Fonction pour filtrer les catégories non validées
export const fetchunvalidatedCategories = async (): Promise<Category[]> => {
    const { unvalidatedCategories } = await processCategories(await fetchCategories());
      return unvalidatedCategories;
};

// Fonction pour filtrer les catégories en attente de validation
export const fetchPendingCategories = async (): Promise<Category[]> => {
    const { pendingCategories } = await processCategories(await fetchCategories());
    console.log("pendingCategories = ", pendingCategories);
      return pendingCategories;
};

// Fonction pour filtrer les catégories actives
export const fetchInactiveCategories = async (): Promise<Category[]> => {
    const { inactiveCategories } = await processCategories(await fetchCategories());
      return inactiveCategories;
};

// Fonction pour compter le nombre de produit d'une Catégorie
export const fetchCategoryStats = async (categories: Category[]): Promise<Category[]> => {
  try {
    const query = categories.map((category) => category.id);
    const { data } = await api.post("products/productcount/", {category_ids: query});
    const CategoryData: Category[] = Object.entries(categories).map(([key, value]: [string, Category]) => ({
      id: value.id,
      name: value.name,
      created_by: value.created_by,
      description: value.description,
      parent_category_id: value.parent_category_id,
      icon_url: value.icon_url,
      is_active: value.is_active,
      is_pending: value.is_pending,
      productCount: data[value.id] || 0,
      sales: data[value.id] || 0,
    }));
    return CategoryData
} catch (error: any) {
    ErreurMessage(error);
    return categories;
  }
};

// Fonction pour créer une categorie
export const CreateCategory = async (category_data) => {
  try {
    const { data } = await api.post(`/categories/`, category_data);
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return {};
  }
};

// Fonction pour toute modification sur une categorie
export const UpdateCategory = async (category_id, category_data) => {
  try {
    const { data } = await api.put(`/categories/${category_id}`, category_data);
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return {};
  }
};

// Fonction pour supprimer une categorie
export const DeleteCategory = async (category_id) => {
  try {
    const { data } = await api.delete(`/categories/${category_id}`);
    // const { data } = await api.delete(`/products/${category_id}`);
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return {};
  }
};

// Fonction pour compter toutes les categories
export const CategoryCount = async () => {
  try {
    const { data } = await api.get(`/categories/count/`);
    return data;
  } catch (error: any) {
    ErreurMessage(error);
    return {};
  }
};