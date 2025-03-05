
export interface Order {
    id: string,                     // ID de la commande
    buyer_id: string,               // ID de l'utilisateur ayant passé la commande
    seller_id: string,              // ID du vendeur
    items: [
        product_id: string,         // ID des produits de la commande
        quantity: number,           // Quantité de chaque produit de la commande
        unit?: string[]             // unité de mesure de la quantité
    ]                               // Liste des articles dans la commande (avec quantités et prix)
    total_price: number,            // Prix total de la commande
    currency: string,               // Devise utilisée pour la commande
    status: string,                 // Statut de la commande (pending, paid, shipped, delivered, canceled)
    payment_id?: string,            // ID du paiement associé
    shipping_address: string[],     // Adresse de livraison de la commande
    billing_address?: string[],     // Adresse de facturation, si différente de l'adresse de livraison
    is_gift: boolean,               // Indique si la commande est un cadeau
    created_at: string              // Date de création de la commande
}

export interface OderData { 
    id: any; 
    buyer: string; 
    seller_name: any; 
    productName: any; 
    price: any; 
    currency: any; 
    quantity: any; 
    image: any;
    buyer_id: any;
    status: any;
    date: any;
    category_ids?: string[]; }