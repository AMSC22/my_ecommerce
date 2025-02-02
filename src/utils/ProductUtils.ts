import { Product } from "../entities/Product";

export const normalizeString = (str: string): string => {
    // Supprime les accents et normalise la chaine
    return str.normalize("NFD").replace("/[\u0300-\u036f]/g", "").toLowerCase();
};

export const filterAndSortProduct = (
    products: Product[],
    search: string,
    sortBy: string,
    order: string
): Product[] => {
  return products
    .filter((product) =>
        normalizeString(product.name).includes(normalizeString(search))
    )
    .sort((a, b) => {
        let valueA, valueB;
        // Définir les valeurs à comparer en fontion de "sortBy"
        if (sortBy === "name") {
            valueA = normalizeString(a.name);
            valueB = normalizeString(b.name);
        } else if (sortBy === "rating") {
            valueA = a.rating || 0;
            valueB = b.rating || 0;
        } else if (sortBy === "price") {
            valueA = a.price || 0;
            valueB = b.price || 0;
        } else {
            return 0; // aucun tri
        }
        // Retourne le tri basé sur "order"
        if ( valueA < valueB ) return order === "asc" ? -1 : 1;
        if ( valueA > valueB ) return order === "asc" ? 1 : -1;
        return 0;
    });
};
