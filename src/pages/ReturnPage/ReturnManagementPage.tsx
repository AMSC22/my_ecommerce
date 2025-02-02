import React, { useState } from "react";
import Button from "../../components/Button.tsx";
import { useNavigate } from "react-router-dom";

interface ReturnRequest {
  id: number;
  productName: string;
  userName: string;
  reason: string;
  additionalDetails: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
  justification?: File | null; // Justificatif du retour
}

const ReturnManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ReturnRequest[]>([
    {
      id: 1,
      productName: "Smartphone XYZ",
      userName: "Jean Dupont",
      reason: "Produit défectueux",
      additionalDetails: "L'écran est fissuré.",
      status: "Pending",
      date: "2025-01-10",
    },
    {
      id: 2,
      productName: "Casque Bluetooth ABC",
      userName: "Marie Curie",
      reason: "Produit non conforme à la description",
      additionalDetails: "Couleur différente de celle commandée.",
      status: "Pending",
      date: "2025-01-09",
    },
  ]);

  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(null);
  const [justificationFile, setJustificationFile] = useState<File | null>(null);

  const handleStatusChange = (id: number, newStatus: "Approved" | "Rejected") => {
    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, status: newStatus } : req
      )
    );
  };

  const handleUploadJustification = (id: number) => {
    if (!justificationFile) {
      alert("Veuillez sélectionner un fichier avant de le télécharger.");
      return;
    }

    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === id ? { ...req, justification: justificationFile } : req
      )
    );

    setJustificationFile(null); // Réinitialiser l'état
    setSelectedRequestId(null); // Fermer le modal ou champ lié
    alert("Justificatif téléchargé avec succès !");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Gestion des retours</h1>
        <p className="text-gray-600 text-center">
          Consultez et gérez les demandes de retour soumises par les utilisateurs.
        </p>
      </header>

      {/* Liste des demandes de retour */}
      <section>
        <h2 className="text-xl font-bold mb-4">Demandes en cours</h2>
        {requests.length === 0 ? (
          <p className="text-gray-500">Aucune demande de retour en cours.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">ID</th>
                <th className="border border-gray-300 p-2">Nom du produit</th>
                <th className="border border-gray-300 p-2">Utilisateur</th>
                <th className="border border-gray-300 p-2">Raison</th>
                <th className="border border-gray-300 p-2">Détails</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Statut</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="border border-gray-300 p-2 text-center">{request.id}</td>
                  <td className="border border-gray-300 p-2">{request.productName}</td>
                  <td className="border border-gray-300 p-2">{request.userName}</td>
                  <td className="border border-gray-300 p-2">{request.reason}</td>
                  <td className="border border-gray-300 p-2">{request.additionalDetails}</td>
                  <td className="border border-gray-300 p-2 text-center">{request.date}</td>
                  <td
                    className={`border border-gray-300 p-2 text-center font-semibold ${
                      request.status === "Pending"
                        ? "text-yellow-600"
                        : request.status === "Approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {request.status}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {request.status === "Pending" && (
                      <div className="flex flex-col space-y-2">
                        <Button
                          label="Approuver"
                          onClick={() => handleStatusChange(request.id, "Approved")}
                          className="bg-green-500 text-white px-2 py-1 rounded"
                        />
                        <Button
                          label="Rejeter"
                          onClick={() => handleStatusChange(request.id, "Rejected")}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        />
                      </div>
                    )}
                    <div className="mt-2">
                      <input
                        type="file"
                        onChange={(e) =>
                          e.target.files && setJustificationFile(e.target.files[0])
                        }
                        className="border border-gray-300 rounded p-1"
                      />
                      <Button
                        label="Télécharger"
                        onClick={() => handleUploadJustification(request.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded mt-1"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Navigation vers d'autres pages */}
      <footer className="mt-6 flex justify-between">
        <Button
          label="Retour"
          onClick={() => navigate("Naviguer vers la page précédente.")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        />
        <Button
          label="Voir le statut des retours"
          onClick={() => navigate("/return-status")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        />
        <Button
          label="Validation des retours"
          onClick={() => navigate("/return-approval")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        />
      </footer>
    </div>
  );
};

export default ReturnManagementPage;