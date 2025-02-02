import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.tsx";
import BarChart from "../components/BarChart.tsx";

interface Affiliation {
  id: number;
  name: string;
  email: string;
  date: string;
  rewards: number;
}

const AffiliationPage: React.FC = () => {
  const navigate = useNavigate();
  const [referralLink, setReferralLink] = useState("https://myshop.com/referral/12345");
  const [affiliates, setAffiliates] = useState<Affiliation[]>([
    { id: 1, name: "Alice Dupont", email: "alice@example.com", date: "2025-01-01", rewards: 10 },
    { id: 2, name: "Jean Martin", email: "jean@example.com", date: "2025-01-03", rewards: 15 },
    { id: 3, name: "Marie Curie", email: "marie@example.com", date: "2025-01-05", rewards: 20 },
  ]);

  const totalRewards = affiliates.reduce((sum, affiliate) => sum + affiliate.rewards, 0);

  const monthlyStats = [
    { month: "Janvier", affiliates: 3, rewards: 45 },
    { month: "Février", affiliates: 5, rewards: 75 },
    { month: "Mars", affiliates: 4, rewards: 60 },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Lien de parrainage copié !");
  };

  const handleInviteFriends = () => {
    alert("Lien de parrainage envoyé !");
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Affiliations</h1>
        <p className="text-gray-600">
          Invitez vos amis à rejoindre notre plateforme et gagnez des récompenses.
        </p>
      </header>

      {/* Lien de parrainage */}
      <section className="bg-white p-4 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-bold mb-2">Votre lien de parrainage</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="border rounded-l-md p-2 flex-1"
          />
          <Button
            label="Copier"
            onClick={handleCopyLink}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md"
          />
        </div>
      </section>

      {/* Récompenses */}
      <section className="bg-green-100 p-4 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-bold mb-2">Récompenses accumulées</h2>
        <p className="text-2xl font-semibold">{totalRewards.toFixed(2)} €</p>
      </section>

      {/* Affiliés */}
      <section className="bg-white p-4 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-bold mb-4">Vos affiliés</h2>
        {affiliates.length > 0 ? (
          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">Nom</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Récompenses (€)</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((affiliate) => (
                <tr key={affiliate.id}>
                  <td className="border p-2">{affiliate.name}</td>
                  <td className="border p-2">{affiliate.email}</td>
                  <td className="border p-2">{affiliate.date}</td>
                  <td className="border p-2">{affiliate.rewards.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">Aucun affilié pour le moment.</p>
        )}
      </section>

      {/* Graphique des statistiques */}
      <section className="bg-white p-4 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-bold mb-4">Statistiques de parrainage</h2>
        <BarChart
          data={monthlyStats.map((stat) => stat.rewards)}
          labels={monthlyStats.map((stat) => stat.month)}
        />
      </section>

      {/* Statistiques détaillées */}
      <section className="bg-white p-4 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-bold mb-4">Détails des statistiques</h2>
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border p-2">Mois</th>
              <th className="border p-2">Nombre d'affiliés</th>
              <th className="border p-2">Récompenses générées (€)</th>
            </tr>
          </thead>
          <tbody>
            {monthlyStats.map((stat) => (
              <tr key={stat.month}>
                <td className="border p-2">{stat.month}</td>
                <td className="border p-2">{stat.affiliates}</td>
                <td className="border p-2">{stat.rewards.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Bouton d'invitation */}
      <footer className="mt-6 text-center">
        <Button
          label="Inviter des amis"
          onClick={handleInviteFriends}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        />
      </footer>
      {/* Bouton Retour */}
      <Button
        label="Retour au tableau de bord"
        onClick={() => navigate("/")}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded-lg"
      />
    </div>
  );
};

export default AffiliationPage;
