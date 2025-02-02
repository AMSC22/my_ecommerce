import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";
import Loader from "../../components/Loader.tsx";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Acheteur" | "Vendeur" | "Administrateur";
  status: "Actif" | "Suspendu";
  joinedDate: string;
}

interface HistoryItem {
  id: number;
  date: string;
  admin: string;
  changes: string;
}

const AdminUserManagementEditPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Simuler la récupération des données utilisateur et historique
    const fetchData = async () => {
      const mockUser: User = {
        id: Number(userId),
        name: "Jean Dupont",
        email: "jean.dupont@example.com",
        role: "Acheteur",
        status: "Actif",
        joinedDate: "2024-10-15",
      };

      const mockHistory: HistoryItem[] = [
        {
          id: 1,
          date: "2025-01-01",
          admin: "Admin Principal",
          changes: "Statut modifié de Suspendu à Actif.",
        },
        {
          id: 2,
          date: "2025-01-05",
          admin: "Admin Secondaire",
          changes: "Rôle modifié de Acheteur à Vendeur.",
        },
      ];

      setUser(mockUser);
      setUpdatedUser(mockUser);
      setHistory(mockHistory);
      setIsLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (updatedUser) {
      setUpdatedUser({ ...updatedUser, [name]: value });
    }
  };

  const handleSaveChanges = () => {
    if (!updatedUser) return;

    // Simuler l'enregistrement des modifications
    const changes: string[] = [];
    if (user?.role !== updatedUser.role) {
      changes.push(`Rôle modifié de ${user?.role} à ${updatedUser.role}.`);
    }
    if (user?.status !== updatedUser.status) {
      changes.push(`Statut modifié de ${user?.status} à ${updatedUser.status}.`);
    }

    setHistory((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        date: new Date().toISOString().split("T")[0],
        admin: "Admin Actuel",
        changes: changes.join(" "),
      },
    ]);

    setUser(updatedUser);
    alert("Modifications enregistrées avec succès !");
    navigate("/admin-user-management");
  };

  if (isLoading) return <Loader />;

  if (!user) {
    return <div className="p-6 text-center text-red-500">Utilisateur non trouvé.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Modifier l'utilisateur</h1>
        <p className="text-gray-600">Apportez les modifications nécessaires au profil de l'utilisateur.</p>
      </header>

      <form className="space-y-4">
        {/* Nom */}
        <div>
          <label className="block text-sm font-bold mb-2">Nom :</label>
          <input
            type="text"
            name="name"
            value={updatedUser?.name}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-bold mb-2">Email :</label>
          <input
            type="email"
            name="email"
            value={updatedUser?.email}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* Rôle */}
        <div>
          <label className="block text-sm font-bold mb-2">Rôle :</label>
          <select
            name="role"
            value={updatedUser?.role}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          >
            <option value="Acheteur">Acheteur</option>
            <option value="Vendeur">Vendeur</option>
            <option value="Administrateur">Administrateur</option>
          </select>
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-bold mb-2">Statut :</label>
          <select
            name="status"
            value={updatedUser?.status}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          >
            <option value="Actif">Actif</option>
            <option value="Suspendu">Suspendu</option>
          </select>
        </div>

        {/* Date d'inscription */}
        <div>
          <label className="block text-sm font-bold mb-2">Date d'inscription :</label>
          <input
            type="text"
            value={user.joinedDate}
            disabled
            className="w-full border rounded-md p-2 bg-gray-100"
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-4">
          <Button
            label="Annuler"
            type="secondary"
            onClick={() => navigate("/admin-user-management")}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          />
          <Button
            label="Enregistrer"
            type="primary"
            onClick={handleSaveChanges}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          />
        </div>
      </form>

      {/* Historique des modifications */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Historique des modifications</h2>
        <div className="bg-gray-50 p-4 rounded-md shadow-md">
          <ul className="list-disc pl-5">
            {history.map((item) => (
              <li key={item.id} className="mb-2">
                <p>
                  <strong>Date :</strong> {item.date}
                </p>
                <p>
                  <strong>Admin :</strong> {item.admin}
                </p>
                <p>
                  <strong>Changements :</strong> {item.changes}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdminUserManagementEditPage;
