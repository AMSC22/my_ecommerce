import React from "react";

interface ButtonProps {
  label: string;
  onClick: () => void;
  type?: "primary" | "secondary" | "danger" | "link" | "submit";
  size?: "small" | "medium" | "large";
  icon?: React.ReactNode; // Pour intégrer une icône
  disabled?: boolean;
  className?: string; // Ajout de classes supplémentaires si besoin
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "primary",
  size = "medium",
  icon,
  disabled = false,
  className = "",
}) => {
  // Classes par défaut selon le type et la taille
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-semibold focus:outline-none transition-all";

  const typeClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    link: "text-blue-600 hover:text-blue-700 underline",
    submit: "bg-green-600 text-white hover:bg-green-700"
  };

  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${typeClasses[type]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

export default Button;