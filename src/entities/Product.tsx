export interface Product 
    {
      id: string,
      seller_id: string,
      name: string,
      description: string,
      price: number,
      currency: string,
      quantity: number,
      category_id: string,
      images: string[],
      brand: string,
      dimensions?: string, // Dimensions du produit (e.g., 10x15x20 cm)"
      weight?: string, // Poids du produit (e.g., 1.5 kg)
      is_active: boolean, // actif ou désactivé
      is_pending: boolean, // En attente ou validé
      validated_by_admin: string, // Id de l'administrateur ayant validé le produit
      status: string, // Statut du produit (e.g., available, out_of_stock)
      rating: number, // Evalution ou nombre d'étoile
      created_at: string,
    }