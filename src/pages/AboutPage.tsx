import React from "react";
import { useNavigate } from "react-router-dom";
import Tooltip from "../components/TooltipProps.tsx";
import Button from "../components/Button.tsx";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-6">
        {/* Titre principal */}
        <h1 className="text-3xl font-bold text-center mb-6">À propos de nous</h1>

        {/* Section sur l'entreprise */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Notre mission</h2>
          <p className="text-gray-600 leading-7">
            Chez <span className="font-semibold text-blue-600">MyShop</span>, notre objectif est de fournir une expérience de shopping en ligne simple, rapide et agréable. Nous croyons en l'importance de la diversité et de la qualité des produits pour satisfaire les besoins de tous nos clients.
          </p>
        </section>

        {/* Section sur les valeurs */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Nos valeurs</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-4">
              <Tooltip message="La satisfaction des clients est notre priorité" position="right">
                <span className="text-2xl">⭐</span>
              </Tooltip>
              <p>Excellence dans le service client</p>
            </li>
            <li className="flex items-center gap-4">
              <Tooltip message="Nous offrons des produits de la plus haute qualité" position="right">
                <span className="text-2xl">✅</span>
              </Tooltip>
              <p>Engagement envers la qualité</p>
            </li>
            <li className="flex items-center gap-4">
              <Tooltip message="Nous croyons en la diversité et l'inclusion" position="right">
                <span className="text-2xl">🌍</span>
              </Tooltip>
              <p>Diversité et inclusion</p>
            </li>
          </ul>
        </section>

        {/* Section sur l'équipe */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Notre équipe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Membre de l'équipe"
                className="w-32 h-32 rounded-full mx-auto mb-2"
              />
              <h3 className="text-lg font-semibold">Jean Dupont</h3>
              <p className="text-gray-500 text-sm">PDG</p>
            </div>
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Membre de l'équipe"
                className="w-32 h-32 rounded-full mx-auto mb-2"
              />
              <h3 className="text-lg font-semibold">Marie Curie</h3>
              <p className="text-gray-500 text-sm">Responsable marketing</p>
            </div>
            <div className="text-center">
              <img
                src="https://via.placeholder.com/150"
                alt="Membre de l'équipe"
                className="w-32 h-32 rounded-full mx-auto mb-2"
              />
              <h3 className="text-lg font-semibold">Albert Einstein</h3>
              <p className="text-gray-500 text-sm">Développeur principal</p>
            </div>
          </div>
        </section>

        {/* Call-to-action */}
        <section className="text-center mt-8">
          <h2 className="text-2xl font-semibold mb-4">Envie d'en savoir plus ?</h2>
          <p className="text-gray-600 mb-6">
            Explorez nos produits, contactez-nous ou découvrez nos projets pour l'avenir.
          </p>
          <Button
            label="Découvrir nos produits"
            type="primary"
            onClick={() => navigate("/categories")}
          />
        </section>
      </div>
    </div>
  );
};

export default AboutPage;