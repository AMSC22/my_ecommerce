import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button.tsx";

interface CardProps {
  image?: string;
  title: string;
  description?: string;
  price?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  className?: string;
  link?: string;
  data?: any;
  footer?: any;
}

const Card: React.FC<CardProps> = ({
  image,
  title,
  description,
  price,
  actionLabel = "Voir plus",
  onActionClick,
  className = "",
  link,
  data,
  footer,
}) => {
  // Contenu principal de la carte
  const cardContent = (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 ${className}`}
    >
      {/* Image */}
      <div className="w-full h-48 bg-gray-200">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
        {price && <p className="text-xl font-bold text-blue-600 mt-2">{price}</p>}
        {footer && footer}
        {onActionClick && (
          <div className="mt-4">
            <Button label={actionLabel} onClick={onActionClick} type="primary" size="medium" />
          </div>
        )}
      </div>
    </div>
  );

  // Si un lien est fourni, enveloppez la carte dans un `Link`
  return link ? <Link to={link}>{cardContent}</Link> : cardContent;
};

export default Card;