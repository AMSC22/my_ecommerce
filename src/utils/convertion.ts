// Fonction pour traduire
export const convertData = (value: string) => {
    // Trouver l'index de l'élément dans la liste 'elements'
    if (value === "pending") {
        return "En attente"
    } else if (value === "paid") {
        return "Livrée"
    }else if (value === "canceled") {
        return "Annulé"
    }else if (value === "delivered") {
        return "Expédiée"
    }else if (value === "shipped") {
        return "En cours"
    }
};