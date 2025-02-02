import React from "react";

interface LoaderProps {
  type?: "spinner" | "bar"; // Type de loader
  size?: "small" | "medium" | "large"; // Taille du loader
  message?: string; // Texte sous le loader
  overlay?: boolean; // Afficher un overlay
}

const Loader: React.FC<LoaderProps> = ({
  type = "spinner",
  size = "medium",
  message = "Chargement...",
  overlay = false,
}) => {
  const sizeClasses = {
    small: "w-6 h-6 border-2",
    medium: "w-10 h-10 border-4",
    large: "w-16 h-16 border-4",
  };

  return (
    <div
      className={`flex items-center justify-center ${
        overlay ? "fixed inset-0 bg-black bg-opacity-50 z-50" : ""
      }`}
    >
      {type === "spinner" ? (
        <div
          className={`animate-spin rounded-full border-t-blue-500 border-gray-300 ${sizeClasses[size]}`}
          role="status"
          aria-label="Chargement"
        ></div>
      ) : (
        <div
          className="w-full h-2 bg-gray-300 relative overflow-hidden"
          role="status"
          aria-label="Chargement"
        >
          <div className="absolute h-full bg-blue-500 animate-progress"></div>
        </div>
      )}
      {message && <p className="mt-4 text-sm text-gray-500">{message}</p>}
    </div>
  );
};

export default Loader;