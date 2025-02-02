import { Category } from "../entities/Categories";

export const normalizeString = (str: string): string => {
    // Supprime les accents et normalise la chaine
    return str.normalize("NFD").replace("/[\u0300-\u036f]/g", "").toLowerCase();
};

export const filterAndSortCategories = (
  categories: Category[],
  search: string,
  sortBy: string,
  order: string
): Category[] => {
  return categories
    .filter((category) =>
        normalizeString(category.name).includes(normalizeString(search))
    )
    .sort((a, b) => {
        let valueA, valueB;
        // Définir les valeurs à comparer en fontion de "sortBy"
        if (sortBy === "name") {
            valueA = normalizeString(a.name);
            valueB = normalizeString(b.name);
        } else if (sortBy === "productCount") {
            valueA = a.productCount || 0;
            valueB = b.productCount || 0;
        } else if (sortBy === "sales") {
            valueA = a.sales || 0;
            valueB = b.sales || 0;
        } else {
            return 0; // aucun tri
        }
        // Retourne le tri basé sur "order"
        if ( valueA < valueB ) return order === "asc" ? -1 : 1;
        if ( valueA > valueB ) return order === "asc" ? 1 : -1;
        return 0;
    });
};
