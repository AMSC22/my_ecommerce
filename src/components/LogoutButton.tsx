import React from "react";
import Button from "./Button.tsx";

const LogoutButton: React.FC = () => {
    const handleLogout = () => {
      localStorage.removeItem("token"); // Suppression du token
      alert("Déconnexion réussie !");
      window.location.href = "/login"; // Redirection
    };
  
    return <Button label="Se déconnecter" onClick={handleLogout} />;
  };

  export default LogoutButton;
  