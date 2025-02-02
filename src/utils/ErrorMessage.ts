
export const ErreurMessage = (message: any) => {
        // Erreur de reponse HTTP
    if (message.response.status === 404) {
        throw new Error("Ressource Introuvable.");
    } else if (message.response.status === 500) {
        throw new Error("Erreur liée au serveur. Veuillez réessayez plus tard.");
    } else if (message.request) {
        // Erreur liée au réseau
        throw new Error("Impossible de se connecter au serveur. Veuillez vérifier votre connexion.");
    } else {
        // Erreur autre
        throw new Error("Une erreur inconnue est survenue.");
    }
}