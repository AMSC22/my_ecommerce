import React from "react";
import Button from "../../components/Button.tsx";
import { useNavigate } from "react-router-dom";

const TermsAndConditionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Termes et Conditions</h1>
        <p className="text-gray-600 text-center">Dernière mise à jour : 10 janvier 2025</p>
      </header>

      {/* Contenu */}
      <section className="space-y-6">
        {/* Section existante */}
        <div>
          <h2 className="text-xl font-bold mb-2">1. Introduction</h2>
          <p className="text-gray-700">
            Bienvenue sur notre plateforme. En utilisant nos services, vous acceptez les termes et
            conditions décrits ci-dessous. Veuillez les lire attentivement avant d'utiliser notre
            site.
          </p>
        </div>

        {/* Section existante */}
        <div>
          <h2 className="text-xl font-bold mb-2">2. Accès et utilisation</h2>
          <p className="text-gray-700">En accédant à notre site, vous acceptez de :</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Fournir des informations exactes et à jour lors de votre inscription.</li>
            <li>Ne pas utiliser notre site pour des activités frauduleuses ou illégales.</li>
            <li>Respecter les droits de propriété intellectuelle de notre contenu.</li>
          </ul>
        </div>

        {/* Nouvelle section : Responsabilités des vendeurs */}
        <div>
          <h2 className="text-xl font-bold mb-2">3. Responsabilités des vendeurs</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Fournir des descriptions et des images précises des produits mis en vente.</li>
            <li>Traiter les commandes dans les délais spécifiés.</li>
            <li>Assurer un service après-vente en cas de retours ou de plaintes.</li>
          </ul>
        </div>

        {/* Nouvelle section : Responsabilités des acheteurs */}
        <div>
          <h2 className="text-xl font-bold mb-2">4. Responsabilités des acheteurs</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Fournir des informations exactes pour la livraison et le paiement.</li>
            <li>Respecter les politiques de retour définies par les vendeurs ou la plateforme.</li>
            <li>Utiliser les produits achetés de manière responsable.</li>
          </ul>
        </div>

        {/* Section existante */}
        <div>
          <h2 className="text-xl font-bold mb-2">5. Comptes utilisateurs</h2>
          <p className="text-gray-700">
            Vous êtes responsable de la confidentialité de vos informations de compte et de toutes
            les activités qui y sont associées.
          </p>
        </div>

        {/* Section existante */}
        <div>
          <h2 className="text-xl font-bold mb-2">6. Produits et services</h2>
          <p className="text-gray-700">
            Nous faisons de notre mieux pour fournir des descriptions précises des produits et
            services, mais nous ne garantissons pas que ces descriptions soient entièrement exactes,
            complètes ou sans erreur.
          </p>
        </div>

        {/* Nouvelle section : Gestion des retours */}
        <div>
          <h2 className="text-xl font-bold mb-2">7. Politique de retour</h2>
          <p className="text-gray-700">
            Les retours sont acceptés dans un délai de 30 jours après réception du produit. Les
            produits retournés doivent être dans leur état d'origine et accompagnés de leur
            emballage d'origine. Des frais de retour peuvent s'appliquer.
          </p>
        </div>

        {/* Section existante */}
        <div>
          <h2 className="text-xl font-bold mb-2">8. Limitation de responsabilité</h2>
          <p className="text-gray-700">
            Nous ne pouvons être tenus responsables des dommages directs ou indirects résultant de
            l'utilisation de notre plateforme ou des services.
          </p>
        </div>

        {/* Section existante */}
        <div>
          <h2 className="text-xl font-bold mb-2">9. Modification des termes</h2>
          <p className="text-gray-700">
            Nous nous réservons le droit de modifier ces termes à tout moment. Les modifications
            prendront effet dès leur publication sur cette page.
          </p>
        </div>

        {/* Section existante */}
        <div>
          <h2 className="text-xl font-bold mb-2">10. Contact</h2>
          <p className="text-gray-700">
            Pour toute question ou demande concernant ces termes, vous pouvez nous contacter :
          </p>
          <p className="text-gray-700 font-semibold">Email : support@myshop.com</p>
          <p className="text-gray-700 font-semibold">Téléphone : +33 1 23 45 67 89</p>
        </div>
      </section>

      {/* Bouton Retour */}
      <footer className="mt-6 text-center">
        <Button
          label="Retour à l'accueil"
          onClick={() => navigate("/")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        />
      </footer>
    </div>
  );
};

export default TermsAndConditionsPage;
