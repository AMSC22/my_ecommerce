export interface Review {
    id: string, // ID unique de l'évaluation
    product_id: string, // ID du produit évalué
    product_name: string,
    user_name: string, // ID de l'utilisateur ayant laissé l'évaluation
    rating: number, // Note sur 5
    comment?: string, // Commentaire de l'utilisateur
    created_at: string, // Date de création de l'évaluation
}