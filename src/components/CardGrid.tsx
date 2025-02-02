import React from 'react'
import Card from "./Card.tsx";
import Button from "./Button.tsx";

const CardGrid: React.FC = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card
          image="https://via.placeholder.com/300"
          title="Produit 1"
          price="29.99 €"
          actionLabel="Ajouter au panier"
          onActionClick={() => console.log("Ajouté au panier")}
        />
        <Card
          image="https://via.placeholder.com/300"
          title="Produit 2"
          price="39.99 €"
          actionLabel="Ajouter au panier"
          onActionClick={() => console.log("Ajouté au panier")}
        />
        <Card
          image="https://via.placeholder.com/300"
          title="Produit 3"
          price="19.99 €"
          actionLabel="Ajouter au panier"
          onActionClick={() => console.log("Ajouté au panier")}
        />
        <Card
          image="https://via.placeholder.com/300"
          title="Produit 4"
          price="59.99 €"
          actionLabel="Ajouter au panier"
          onActionClick={() => console.log("Ajouté au panier")}
        />
      </div>
    );
  };
  
  export default CardGrid;