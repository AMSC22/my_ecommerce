export interface Users {
    id: string,  // ID de l'utilisateur
    first_name: string, // Prénom de l'utilisateur
    last_name: string, // Nom de l'utilisateur
    email: string, // Email de l'utilisateur
    hashed_password: string, // Mot de passe haché de l'utilisateur
    role: string, // Rôle de l'utilisateur (e.g., buyer, seller, admin)
    phone?: string, // Numéro de téléphone de l'utilisateur
    address?: string, // Adresse de l'utilisateur
    profile_image_url?: string, // URL de l'image de profil de l'utilisateur
    is_active: boolean // Statut de vérification de l'utilisateur
    created_at: string // Date de creation du compte
}