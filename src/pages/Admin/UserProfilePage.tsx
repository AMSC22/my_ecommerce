import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";
import Loader from "../../components/Loader.tsx";
import { Users } from "../../entities/Users.tsx";
import { fetchUser } from "../../services/UserService.ts";

interface Action {
  id: number;
  type: "Commande" | "Retour" | "Paiement";
  details: string;
  amount?: number;
  date: string;
  status: string;
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<Users[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({ type: "Tous", status: "Tous" });
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");

  const convertion = (role: string) => {
    if (role === "buyer") {return "Acheteur"}
    else if (role === "seller") {return "Vendeur"}
    else if (role === "admin") {return "Administrateur"}
  };

  useEffect(() => {
    // Simuler la récupération des données utilisateur et des actions
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setMessage(null);
        const mockUser: Users[] = await fetchUser([userId || ""]);
        setUser(mockUser);
        setLoading(false);
        setMessage(null);
      } catch (error: any) {
        setMessage("Erreur de chargement des utilisateurs.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }

      const mockActions: Action[] = [
        {
          id: 1,
          type: "Commande",
          details: "Commande de Smartphone XYZ",
          amount: 699.99,
          date: "2025-01-10",
          status: "Livré",
        },
        {
          id: 2,
          type: "Paiement",
          details: "Paiement via Visa pour Commande #1",
          amount: 699.99,
          date: "2025-01-10",
          status: "Réussi",
        },
        {
          id: 3,
          type: "Retour",
          details: "Demande de retour pour Smartphone XYZ",
          date: "2025-01-12",
          status: "Approuvé",
        },
      ];
      setActions(mockActions);
      setIsLoading(false);
    };

    fetchUserData();
  }, [userId]);

  const filteredActions = actions.filter(
    (action) =>
      (filter.type === "Tous" || action.type === filter.type) &&
      (filter.status === "Tous" || action.status === filter.status)
  );

  const addNote = () => {
    if (newNote.trim() === "") return;
    setNotes((prev) => [...prev, newNote]);
    setNewNote("");
  };

  if (isLoading) return <Loader />;

  if (!user) {
    return <div className="p-6 text-center text-red-500">Utilisateur non trouvé.</div>;
  }

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      {/* En-tête */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Profil de l'utilisateur</h1>
        <p className="text-gray-600">
          Affichez les informations détaillées et l'historique des actions de l'utilisateur.
        </p>
        {message && <p className="mb-4 text-green-500">{message}</p>}
      </header>

      {/* Détails de l'utilisateur */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Informations personnelles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p>
              <strong>Nom :</strong> {user[0].first_name} {user[0].last_name}
            </p>
            <p>
              <strong>Email :</strong> {user[0].email}
            </p>
          </div>
          <div>
            <p>
              <strong>Rôle :</strong> {convertion(user[0].role)}
            </p>
            <p>
              <strong>Statut :</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-white text-sm ${
                  (user[0].is_active ? "Actif" : "Suspendu") === "Actif" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {user[0].is_active ? "Actif" : "Suspendu"}
              </span>
            </p>
          </div>
          <div>
            <p>
              <strong>Date d'inscription :</strong> {user[0].created_at.split("T")[0]}
            </p>
          </div>
        </div>
      </section>

      {/* Historique des actions */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Historique des actions</h2>
        <div className="flex gap-4 mb-4">
          <select
            className="border p-2 rounded-md"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="Tous">Tous les types</option>
            <option value="Commande">Commande</option>
            <option value="Paiement">Paiement</option>
            <option value="Retour">Retour</option>
          </select>
          <select
            className="border p-2 rounded-md"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Livré">Livré</option>
            <option value="Réussi">Réussi</option>
            <option value="Approuvé">Approuvé</option>
          </select>
        </div>
        <div className="bg-gray-50 p-4 rounded-md shadow-md overflow-auto">
          {filteredActions.length > 0 ? (
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Type</th>
                  <th className="border p-2">Détails</th>
                  <th className="border p-2">Montant (€)</th>
                  <th className="border p-2">Date</th>
                  <th className="border p-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredActions.map((action) => (
                  <tr key={action.id} className="hover:bg-gray-50">
                    <td className="border p-2">{action.type}</td>
                    <td className="border p-2">{action.details}</td>
                    <td className="border p-2">
                      {action.amount ? action.amount.toFixed(2) : "-"}
                    </td>
                    <td className="border p-2">{action.date}</td>
                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm ${
                          action.status === "Livré" || action.status === "Réussi"
                            ? "bg-green-500"
                            : action.status === "En attente"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {action.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">Aucune action trouvée.</p>
          )}
        </div>
      </section>

      {/* Notes et Avertissements */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Notes et Avertissements</h2>
        <div className="bg-gray-50 p-4 rounded-md shadow-md">
          <ul className="list-disc pl-5 mb-4">
            {notes.map((note, index) => (
              <li key={index} className="mb-2">
                {note}
              </li>
            ))}
          </ul>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Ajouter une note ou un avertissement"
              className="border p-2 rounded-md flex-1"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <Button label="Ajouter" onClick={addNote} className="bg-blue-500 text-white px-4 py-2 rounded-md" />
          </div>
        </div>
      </section>

      {/* Boutons */}
      <footer className="mt-6 flex justify-between">
        <Button
          label="Retour"
          onClick={() => navigate("/admin-user-management")}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        />
        <Button
          label="Modifier"
          onClick={() => navigate(`/admin-user-management/edit/${user[0].id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        />
      </footer>
    </div>
  );
};

export default UserProfilePage;
