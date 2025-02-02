import React from "react";
import Button from "./Button.tsx"; // Si vous avez un composant Button

interface NoElementComponentProps {
  message?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

const NoElementComponent: React.FC<NoElementComponentProps> = ({
  message = "Aucun élément à afficher.",
  actionLabel = "Ajouter un élément",
  onActionClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-40">
      <div className="text-blue-500 text-5xl mb-4">📦</div>
      <p className="text-lg text-gray-700 mb-4">{message}</p>
      {onActionClick && (
        <Button
          label={actionLabel}
          onClick={onActionClick}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        />
      )}
    </div>
  );
};

export default NoElementComponent;