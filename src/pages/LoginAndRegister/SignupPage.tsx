import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormComponent from "../../components/FormComponent.tsx";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const fields = [
    {
      name: "firstName",
      label: "Prénom *",
      placeholder: "Entrez votre prénom",
    },
    {
      name: "lastName",
      label: "Nom *",
      placeholder: "Entrez votre nom",
    },
    {
      name: "email",
      label: "Email *",
      type: "email",
      placeholder: "Entrez votre email",
    },
    {
      name: "password",
      label: "Mot de passe *",
      type: "password",
      placeholder: "Entrez un mot de passe",
    },
    {
      name: "confirmPassword",
      label: "Confirmez le mot de passe *",
      type: "password",
      placeholder: "Confirmez le mot de passe",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" }); // Efface les erreurs associées au champ
    setGlobalError(null); // Réinitialise les erreurs globales
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!formData.firstName) newErrors.firstName = "Le prénom est requis.";
    if (!formData.lastName) newErrors.lastName = "Le nom est requis.";
    if (!formData.email) {
      newErrors.email = "L'email est requis.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide.";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted =
        "Vous devez accepter les termes et conditions pour continuer.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setGlobalError("Veuillez corriger les erreurs ci-dessous.");
      return;
    }

    // Soumission des données au serveur
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/login"); // Redirection vers la page de connexion
      } else {
        setGlobalError("Erreur lors de l'inscription. Réessayez plus tard.");
      }
    } catch (error) {
      setGlobalError("Une erreur est survenue. Réessayez plus tard.");
    }
  };

  const handleGoogleSignup = () => {
    setGlobalError("Connexion via Google non implémentée.");
  };

  const handleFacebookSignup = () => {
    setGlobalError("Connexion via Facebook non implémentée.");
  };

  const handleOtherSignup = (provider: string) => {
    setGlobalError(`Connexion via ${provider} non implémentée.`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Créer un compte</h2>
      {globalError && (
        <div className="mb-4 bg-red-100 text-red-800 p-4 rounded-md">
          {globalError}
        </div>
      )}
      <FormComponent
        fields={fields}
        values={{
          ...formData,
          termsAccepted: formData.termsAccepted ? "true" : "false", // Conversion en chaîne
        }}
        errors={errors}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        submitButtonLabel="S'inscrire"
      />
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleInputChange}
            className="mr-2"
          />
          J'accepte les{" "}
          <button
            onClick={() => navigate("/privacy-policy")}
            className="text-blue-500 underline ml-1"
          >
            termes et conditions
          </button>
          .
        </label>
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>
        )}
      </div>
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleGoogleSignup}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Google
        </button>
        <button
          onClick={handleFacebookSignup}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Facebook
        </button>
        <button
          onClick={() => handleOtherSignup("Twitter")}
          className="bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-500"
        >
          Twitter
        </button>
      </div>
      <footer className="mt-6 text-center">
        <p className="text-gray-500">
          Vous avez déjà un compte ?{" "}
          <button
            className="text-blue-500 underline"
            onClick={() => navigate("/login")}
          >
            Se connecter
          </button>
        </p>
      </footer>
    </div>
  );
};

export default SignupPage;
