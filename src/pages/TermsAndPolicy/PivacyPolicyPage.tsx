import React from "react";
import Button from "../../components/Button.tsx";
import { useNavigate } from "react-router-dom";

const PrivacyPolicyPage: React.FC = () => {
    const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Politique de confidentialité</h1>
        <p className="text-gray-600 text-center">
          Dernière mise à jour : 10 janvier 2025
        </p>
      </header>

      {/* Contenu */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Introduction</h2>
          <p className="text-gray-700">
            Bienvenue sur notre plateforme. La protection de vos données personnelles est une
            priorité pour nous. Cette politique de confidentialité explique comment nous collectons,
            utilisons et protégeons vos informations personnelles.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Données collectées</h2>
          <p className="text-gray-700">Nous collectons les types de données suivants :</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Informations de compte (nom, email, numéro de téléphone).</li>
            <li>Informations de paiement (carte bancaire, transactions).</li>
            <li>Historique d'achat et de navigation.</li>
            <li>Adresse IP et données de localisation.</li>
          </ul>
        </div>

        {/* Nouvelle section : Politique de retour */}
        <div>
          <h2 className="text-xl font-bold mb-2">Politique de retour</h2>
          <p className="text-gray-700">
            Les retours produits sont acceptés dans un délai de 30 jours après la réception de l'article.
            Les produits retournés doivent être dans leur état d'origine et accompagnés de leur emballage
            d'origine. Pour initier un retour, connectez-vous à votre compte et soumettez une demande via
            la section "Historique des achats".
          </p>
        </div>

        {/* Nouvelle section : Droits des vendeurs */}
        <div>
          <h2 className="text-xl font-bold mb-2">Droits des vendeurs</h2>
          <p className="text-gray-700">
            Les vendeurs ont le droit de :
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Publier et gérer leurs produits sur la plateforme.</li>
            <li>Recevoir les paiements pour les produits vendus.</li>
            <li>Contacter les acheteurs en cas de questions ou retours.</li>
            <li>Accéder aux statistiques de vente et rapports via leur tableau de bord.</li>
          </ul>
        </div>

        {/* Nouvelle section : Responsabilités des utilisateurs */}
        <div>
          <h2 className="text-xl font-bold mb-2">Responsabilités des utilisateurs</h2>
          <p className="text-gray-700">
            Tous les utilisateurs sont tenus de respecter les règles suivantes :
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Fournir des informations exactes lors de la création de leur compte.</li>
            <li>Utiliser la plateforme de manière responsable et éviter tout comportement abusif.</li>
            <li>Ne pas publier de contenu inapproprié ou illégal.</li>
            <li>Respecter les droits des autres utilisateurs, y compris les vendeurs et administrateurs.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Utilisation des données</h2>
          <p className="text-gray-700">Vos données sont utilisées pour :</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Traiter vos commandes et paiements.</li>
            <li>Améliorer votre expérience utilisateur.</li>
            <li>Personnaliser nos offres et communications.</li>
            <li>Assurer la sécurité de la plateforme.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Partage des données</h2>
          <p className="text-gray-700">
            Vos données personnelles ne seront jamais vendues. Cependant, elles peuvent être
            partagées avec des tiers de confiance dans les cas suivants :
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Avec nos prestataires de services (livraison, paiement).</li>
            <li>Pour se conformer à des obligations légales.</li>
            <li>En cas de fusion ou acquisition de notre entreprise.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Sécurité des données</h2>
          <p className="text-gray-700">
            Nous utilisons des mesures techniques et organisationnelles avancées pour protéger vos
            données contre tout accès non autorisé, perte ou modification.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Vos droits</h2>
          <p className="text-gray-700">En tant qu'utilisateur, vous avez le droit de :</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Accéder à vos données personnelles.</li>
            <li>Modifier ou supprimer vos informations.</li>
            <li>Restreindre ou refuser certains traitements de vos données.</li>
            <li>Porter plainte auprès d'une autorité de protection des données.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Cookies</h2>
          <p className="text-gray-700">
            Notre site utilise des cookies pour améliorer votre expérience. Vous pouvez configurer
            vos préférences de cookies dans les paramètres de votre navigateur.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Contact</h2>
          <p className="text-gray-700">
            Pour toute question ou demande concernant vos données personnelles, vous pouvez nous
            contacter à l'adresse suivante :
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

export default PrivacyPolicyPage;