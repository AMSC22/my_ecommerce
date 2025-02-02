import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Ajout de useNavigate pour une redirection
import Button from "../../components/Button.tsx";

const AdminTicketsPage: React.FC = () => {
  const navigate = useNavigate(); // Permet de rediriger l'utilisateur si nécessaire
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Gestion des erreurs

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/support/tickets");
        if (!response.ok) {
          throw new Error("Impossible de charger les tickets.");
        }
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        setError(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleResolve = async (id: number) => {
    try {
      const response = await fetch(`/api/support/tickets/${id}/resolve`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Impossible de marquer le ticket comme résolu.");
      }

      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Résolu" } : t)));
    } catch (error) {
      alert(error.message || "Erreur lors de la résolution du ticket.");
    }
  };

  const handleBackToDashboard = () => {
    navigate("/"); // Redirection vers le tableau de bord
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Tickets de Support</h1>
        <Button
          label="Retour au Tableau de Bord"
          onClick={handleBackToDashboard}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        />
      </header>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : tickets.length === 0 ? (
        <p>Aucun ticket trouvé.</p>
      ) : (
        <table className="w-full border-collapse border overflow-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Catégorie</th>
              <th className="border px-4 py-2">Statut</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="border px-4 py-2">{ticket.id}</td>
                <td className="border px-4 py-2">{ticket.category}</td>
                <td className="border px-4 py-2">{ticket.status}</td>
                <td className="border px-4 py-2">
                  <Button
                    label="Marquer comme résolu"
                    onClick={() => handleResolve(ticket.id)}
                    className={`px-2 py-1 rounded ${
                      ticket.status === "Résolu" ? "bg-gray-400 text-white" : "bg-green-500 text-white"
                    }`}
                    disabled={ticket.status === "Résolu"}
                  />
                  <Button
                    label="Détails"
                    onClick={() => navigate("/user-tickets")}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminTicketsPage;
