import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";

const ResetPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email) {
      setError("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simuler une requête pour réinitialiser le mot de passe
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulation d'un délai de 2 secondes
      setMessage(
        "Un lien pour réinitialiser votre mot de passe a été envoyé à votre adresse e-mail."
      );
      setEmail(""); // Réinitialiser le champ e-mail
    } catch (err) {
      setError(
        "Une erreur s'est produite lors de la réinitialisation. Veuillez réessayer plus tard."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-md">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Réinitialiser votre mot de passe</h1>
        <p className="text-gray-500 mt-2">
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
        </p>
      </header>

      {message && (
        <div className="mb-4 bg-green-100 text-green-800 p-4 rounded-md">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-100 text-red-800 p-4 rounded-md">{error}</div>
      )}

      <form onSubmit={handleResetPassword} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-2">
            Adresse e-mail :
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            className="w-full border rounded-md p-2"
            disabled={isSubmitting}
          />
        </div>

        <Button
          label={isSubmitting ? "Envoi en cours..." : "Envoyer le lien"}
          type="primary"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
          disabled={isSubmitting}
          onClick={() => ("/login")}
        />
      </form>

      <footer className="mt-6 text-center">
        <p className="text-gray-500">
          Vous vous souvenez de votre mot de passe ?{" "}
          <button
            className="text-blue-500 underline"
            onClick={handleResetPassword}
          >
            Se connecter
          </button>
        </p>
      </footer>
    </div>
  );
};

export default ResetPasswordPage;
