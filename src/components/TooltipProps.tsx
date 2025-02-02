import React from "react";

interface TooltipProps {
  message: string; // Message affiché dans la bulle d'information
  position?: "top" | "bottom" | "left" | "right"; // Position de la bulle
  children: React.ReactNode; // Éléments enfants sur lesquels l'utilisateur passe la souris
}

const Tooltip: React.FC<TooltipProps> = ({
  message,
  position = "top", // Par défaut, la bulle apparaît en haut
  children,
}) => {
  return (
    <div className="relative group inline-block">
      {/* Élément sur lequel on passe la souris */}
      {children}

      {/* Bulle d'information */}
      <div
        className={`absolute z-10 hidden group-hover:flex items-center bg-black text-white text-sm py-1 px-3 rounded shadow-md transition-opacity duration-200 ${
          position === "top" ? "bottom-full mb-2 left-1/2 -translate-x-1/2" : ""
        } ${
          position === "bottom"
            ? "top-full mt-2 left-1/2 -translate-x-1/2"
            : ""
        } ${
          position === "left" ? "right-full mr-2 top-1/2 -translate-y-1/2" : ""
        } ${
          position === "right" ? "left-full ml-2 top-1/2 -translate-y-1/2" : ""
        }`}
      >
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Tooltip;