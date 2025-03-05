import React from "react";
import Button from "./Button.tsx";
import Tooltip from "./TooltipProps.tsx";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  currency: string;
  rating?: number; // Note moyenne du produit (facultatif)
}

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void; // Fonction pour ajouter au panier
  onAddToWishlist?: () => void; // Fonction pour ajouter à la liste de souhaits (facultatif)
  onViewDetails?: () => void; // Fonction pour afficher les détails du produit (facultatif)
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onViewDetails,
}) => {
  const imageLink = "/images/";
  return (
    <div className="border rounded-md shadow-md bg-white p-4">
      {/* Image du produit */}
      <div className="flex justify-center mb-4">
        <img
          src={imageLink + product.image}
          alt={product.name}
          className="w-32 h-32 object-cover rounded-md"
        />
      </div>

      {/* Informations du produit */}
      <h3 className="text-lg font-bold mb-2 text-center">{product.name}</h3>
      <p className="text-blue-600 text-center font-semibold mb-2">
        {product.price.toFixed(2)} {product.currency}
      </p>
      {product.rating && (
        <div className="flex justify-center items-center text-yellow-500 mb-4">
          <Tooltip message={`Note moyenne : ${product.rating} étoiles`}>
            <span className="text-lg">★ {product.rating}</span>
          </Tooltip>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button
          label="Ajouter au panier"
          onClick={onAddToCart}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        />
        {onAddToWishlist && (
          <Button
            label="Ajouter à la liste de souhaits"
            onClick={onAddToWishlist}
            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          />
        )}
        {onViewDetails && (
          <Button
            label="Voir les détails"
            onClick={onViewDetails}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          />
        )}
      </div>
    </div>
  );
};

export default ProductCard;
