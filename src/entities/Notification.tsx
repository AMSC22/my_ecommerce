export interface Notifications {
    id: string, // ID de la notification
    user_id: string, // ID de l'utilisateur destinataire de la notification
    type: string // Type de notification (e.g., message, promotion, système)
    title: string // Titre de la notification
    message: string, // Message de la notification
    is_read: boolean, // Statut de lecture de la notification
    link?: string, // Lien associé à la notification (pour redirection)
    created_at: string, // Date de création de la notification
    read_at?: string // Date à laquelle la notification a été lue
}