import React, { useState } from "react";
import FormComponent from "../components/FormComponent.tsx";
import Tooltip from "../components/TooltipProps.tsx";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  const fields = [
    {
      name: "name",
      label: "Nom complet",
      placeholder: "Entrez votre nom",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Entrez votre email",
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      placeholder: "Écrivez votre message ici",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Le nom est requis.";
    if (!formData.email) newErrors.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Entrez un email valide.";
    if (!formData.message) newErrors.message = "Le message est requis.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Simuler l'envoi du formulaire
    console.log("Formulaire soumis :", formData);
    setSuccessMessage("Merci pour votre message ! Nous vous répondrons sous peu.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Contactez-nous</h1>
        <p className="text-gray-600 text-center mb-6">
          Si vous avez des questions ou des préoccupations, n'hésitez pas à nous écrire.
        </p>

        {successMessage && (
          <div className="bg-green-100 text-green-700 p-4 mb-4 rounded">
            {successMessage}
          </div>
        )}

        <FormComponent
          fields={fields}
          values={formData}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          submitButtonLabel="Envoyer"
        />

        {/* Informations de contact */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Nos coordonnées</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <Tooltip message="Adresse de notre siège" position="top">
                <span className="text-2xl">🏢</span>
              </Tooltip>
              <span>123 Rue de l'Entreprise, 75001 Paris</span>
            </li>
            <li className="flex items-center gap-4">
              <Tooltip message="Appelez-nous" position="top">
                <span className="text-2xl">📞</span>
              </Tooltip>
              <span>+33 1 23 45 67 89</span>
            </li>
            <li className="flex items-center gap-4">
              <Tooltip message="Envoyez-nous un email" position="top">
                <span className="text-2xl">📧</span>
              </Tooltip>
              <span>contact@myshop.com</span>
            </li>
            <li className="flex items-center gap-4">
              <Tooltip message="Contactez-nous sur WhatsApp" position="top">
                <span className="text-2xl">📱</span>
              </Tooltip>
              <a
                href="https://wa.me/33123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-4">
              <Tooltip message="Visitez notre page Facebook" position="top">
                <span className="text-2xl">📘</span>
              </Tooltip>
              <a
                href="https://facebook.com/myshop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;