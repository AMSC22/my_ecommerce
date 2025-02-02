// Fonction pour modifier la valeur d'un élément dans une liste

export const updateData = (element_id: string, elements: any, elementState: string[], value: any) => {
    // Trouver l'index de l'élément dans la liste 'elements'
    const elementIndex = elements.findIndex(element => element.id === element_id);
    console.log("elenetIndex = ", elementIndex);
    console.log("elements[elementIndex] = ", elements);
    // Vérifier si l'élément existe
    if (elementIndex === -1) {
      console.error("Elément non trouvé");
      return null;
    }

    // Copier l'élément trouvé et modifier son statut
    for (let index = 0; index < elementState.length; index++) {
        elements[elementIndex][elementState[index]] = value[index];
    }
    
    return elements[elementIndex]; //updateElement;
};