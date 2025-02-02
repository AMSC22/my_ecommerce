import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";

const UserTicketsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/support/tickets/user");
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Erreur lors du chargement des tickets : ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md overflow-auto">
      <h1 className="text-2xl font-bold mb-6">Historique des Tickets de Support</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : tickets.length === 0 ? (
        <p>Aucun ticket trouvé.</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Catégorie</th>
              <th className="border px-4 py-2">Statut</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="border px-4 py-2">{ticket.id}</td>
                <td className="border px-4 py-2">{ticket.category}</td>
                <td className="border px-4 py-2">{ticket.status}</td>
                <td className="border px-4 py-2">{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Button
      label="Soumettre un nouveau Ticket"
      onClick={() => navigate("/submit-ticket")} />
    </div>
  );
};

export default UserTicketsPage;