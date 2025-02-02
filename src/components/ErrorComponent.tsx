import React from "react";
import Button from "./Button.tsx"; // Si vous avez un composant Button

interface ErrorComponentProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({
  message = "Une erreur est survenue. Veuillez réessayer.",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div className="text-red-600 text-5xl mb-4">❌</div>
      <p className="text-lg text-gray-700 mb-4">{message}</p>
      {onRetry && (
        <Button
          label="Réessayer"
          onClick={onRetry}
          className="bg-red-500 text-white px-6 py-2 rounded-lg"
        />
      )}
    </div>
  );
};

export default ErrorComponent;