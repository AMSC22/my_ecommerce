import React, { useState, useEffect } from "react";
import Button from "../../components/Button.tsx";
import Loader from "../../components/Loader.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { Users } from "../../entities/Users.tsx";
import { fetchAllUsers } from "../../services/UserService.ts";
import { UpdateUserData, DeleteUser } from "../../services/UserService.ts";
import { updateData } from "../../utils/UpdateFunction.ts";

interface User {
  id: number;
  name: string;
  email: string;
  role: "Acheteur" | "Vendeur" | "Administrateur";
  status: "Actif" | "Suspendu";
  joinedDate: string;
}

const AdminUserManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { seller } = useParams<{ sellers: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<"Tous" | "Acheteur" | "Vendeur" | "Administrateur">("Tous");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // IDs des utilisateurs sélectionnés
  const [users, setUsers] = useState<Users[]>([]);

  const [selectedUser, setSelectedUser] = useState<Users | null>(null);
  const [emailContent, setEmailContent] = useState("");
  const user_id = localStorage.getItem("user_id") || ""; // Récupération de l'utilisateur connecté
  
  const convertion = (role: string) => {
    if (role === "buyer") {return "Acheteur"}
    else if (role === "seller") {return "Vendeur"}
    else if (role === "admin") {return "Administrateur"}
    else if (role === "Acheteur") {return "buyer"}
    else if (role === "Vendeur") {return "seller"}
    else if (role === "Administrateur") {return "admin"}
  };
  console.log("seller = ", seller);

  // Chargement des données du Panier
  useEffect(() => {
    const loadCarts = async () => {
      try {
        setLoading(true);
        setMessage(null);
        const allUsers: Users[] = await fetchAllUsers();
        setUsers(allUsers.filter((user) => user_id !== user.id));
        setLoading(false);
        setMessage(null);
      } catch (error: any) {
        setMessage("Erreur de chargement des utilisateurs.");
        // toast.error(error.message || "Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };
    loadCarts();
  }, []);
  
  // Pour exporter les données
  const exportData = () => {
    const csvContent = [
      ["Nom", "Email", "Rôle", "Statut", "Date d'inscription"],
      ...users.map((user) => [
        user.first_name + ' ' + user.last_name,
        user.email,
        user.role,
        user.is_active ? "Actif" : "Suspendu",
        user.created_at,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Gérer la recherche
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterRole(e.target.value as "Tous" | "Acheteur" | "Vendeur" | "Administrateur");
  };

  // Actions groupées
  const handleBulkAction = (action: "Activer" | "Suspendre") => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        selectedUsers.includes(user.id)
          ? { ...user, status: action === "Activer" ? "Actif" : "Suspendu" }
          : user
      )
    );
    setSelectedUsers([]); // Réinitialiser les sélections après action
  };
  
  const handleToggleStatus = async (id: string, is_active: boolean) => {
    try {
      const response = await UpdateUserData(id, updateData(id, users, ["is_active"], [!is_active]));

      if (response) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, status: (user.is_active ? "Actif" : "Suspendu") === "Actif" ? "Suspendu" : "Actif" } : user
          )
        );
      } else {
        setMessage("Erreur lors du changement du statut de l'utilisateur.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }

  };

  // Gérer la selection des utilisateurs
  const handleDeleteUser = async (id: string) => {
    try {
      const response = await DeleteUser(id);

      if (response) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } else {
        setMessage("Erreur lors de la suppression de l'utilisateur.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  const handleRoleChange = async (id: string, newRole: "Acheteur" | "Vendeur" | "Administrateur") => {
    try {
      const response = await UpdateUserData(id, updateData(id, users, ["role"], [convertion(newRole)]));

      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user.id === id ? { ...user, role: newRole } : user))
        );
      } else {
        setMessage("Erreur lors de la modification du role de l'utilisateur.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur de connexion au serveur.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (filterRole === "Tous" || convertion(user.role) === filterRole) &&
      (user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sendEmail = () => {
    if (!selectedUser) return;
    alert(`Email envoyé à ${selectedUser.email} : ${emailContent}`);
    setEmailContent("");
    setSelectedUser(null);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        <p className="text-gray-600">Recherchez, filtrez et gérez les utilisateurs de la plateforme.</p>
        {message && <p className="mb-4 text-green-500">{message}</p>}
      </header>

      {/* Barre de recherche, filtres et exportation */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Rechercher par nom ou email"
          className="border rounded-md p-2 flex-1"
        />
        <select
          value={filterRole}
          onChange={handleRoleFilter}
          className="border rounded-md p-2"
        >
          <option value="Tous">Tous les rôles</option>
          <option value="Acheteur">Acheteurs</option>
          <option value="Vendeur">Vendeurs</option>
          <option value="Administrateur">Administrateur</option>
        </select>
        <Button
          label="Exporter les données"
          onClick={exportData}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        />
      </div>

      {/* Actions groupées */}
      {selectedUsers.length > 0 && (
        <div className="mb-6 flex items-center gap-4">
          <Button
            label={`Activer (${selectedUsers.length})`}
            onClick={() => handleBulkAction("Activer")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          />
          <Button
            label={`Suspendre (${selectedUsers.length})`}
            onClick={() => handleBulkAction("Suspendre")}
            className="bg-red-500 text-white px-4 py-2 rounded"
          />
        </div>
      )}
      
      {/* Tableau des utilisateurs */}
      <section className="bg-white shadow-md rounded-md overflow-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Nom</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Rôle</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Date d'inscription</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border p-2">{user.first_name} {user.last_name}</td>
                  <td className="border p-2">{user.email}</td>
                  {user.role !== "admin" ? 
                  <td className="border p-2">
                    <select
                    value={convertion(user.role)}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as "Acheteur" | "Vendeur" | "Administrateur")
                    }
                    className="border rounded-md p-1"
                  >
                    <option value="Acheteur">Acheteur</option>
                    <option value="Vendeur">Vendeur</option>
                    <option value="Administrateur">Administrateur</option>
                  </select>
                  </td> : <td className="border p-2">{user.role}</td>}
                  <td className="border p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-sm ${
                        (user.is_active ? "Actif" : "Suspendu") === "Actif" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {user.is_active ? "Actif" : "Suspendu"}
                    </span>
                  </td>
                  <td className="border p-2">{user.created_at.split("T")[0]}</td>
                  <td className="border p-2 flex gap-2">
                    <Button
                      label="Détails"
                      onClick={() => setSelectedUser(user)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md"
                    />
                    {user.role !== "admin" ?
                    <>
                    <Button
                      label="Voir le profil"
                      onClick={() => navigate(`/admin-user-profile/${user.id}`)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md"
                    />
                    <Button
                      label={(user.is_active ? "Actif" : "Suspendu") === "Actif" ? "Suspendre" : "Activer"}
                      onClick={() => handleToggleStatus(user.id, user.is_active)}
                      className={`${
                        (user.is_active ? "Actif" : "Suspendu") === "Actif" ? "bg-red-500" : "bg-green-500"
                      } text-white px-2 py-1 rounded-md`}
                    />
                    <Button
                      label="Supprimer"
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-gray-600 text-white px-2 py-1 rounded-md"
                    />
                    </>
                    :(undefined)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="border p-4 text-center text-gray-600">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Modal pour afficher les détails d'un utilisateur */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Détails de l'utilisateur</h2>
            <p><strong>Nom :</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
            <p><strong>Email :</strong> {selectedUser.email}</p>
            <p><strong>Rôle :</strong> {convertion(selectedUser.role)}</p>
            <p><strong>Statut :</strong> {selectedUser.is_active ? "Actif" : "Suspendu"}</p>
            <p><strong>Date d'inscription :</strong> {selectedUser.created_at.split("T")[0]}</p>

            <div className="mt-4">
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Envoyer un email..."
                className="border rounded-md p-2 w-full"
              ></textarea>
              <Button
                label="Envoyer"
                onClick={sendEmail}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
              />
            </div>

            <Button
              label="Fermer"
              onClick={() => setSelectedUser(null)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagementPage;