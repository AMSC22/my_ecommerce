import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/Button.tsx";

interface ReturnRequest {
  id: number;
  productName: string;
  userName: string;
  reason: string;
  additionalDetails: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
  justification?: string; // URL ou nom du fichier justificatif
}

const ReturnApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [request, setRequest] = useState<ReturnRequest | null>(
  //   location.state?.request || null
  // );
  const [request, setRequest] = useState<ReturnRequest | null>(
    location.state || {
      id: 1,
      productName: "Smartphone XYZ",
      userName: "Jean Dupont",
      reason: "Produit défectueux",
      additionalDetails: "L'écran est fissuré.",
      status: "Pending",
      date: "2025-01-10",
    }
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleApprove = () => {
    setRequest((prev) => prev && { ...prev, status: "Approved" });
    setMessage("La demande de retour a été approuvée.");
  };

  const handleReject = () => {
    setRequest((prev) => prev && { ...prev, status: "Rejected" });
    setMessage("La demande de retour a été rejetée.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Validation du retour</h1>
        <p className="text-gray-600 text-center">
          Validez ou rejetez cette demande de retour.
        </p>
      </header>

      {/* Détails de la demande */}
      {request ? (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Détails de la demande</h2>
            <ul className="list-none space-y-2 text-gray-700">
              <li>
                <strong>ID :</strong> {request.id}
              </li>
              <li>
                <strong>Produit :</strong> {request.productName}
              </li>
              <li>
                <strong>Utilisateur :</strong> {request.userName}
              </li>
              <li>
                <strong>Date :</strong> {request.date}
              </li>
              <li>
                <strong>Raison :</strong> {request.reason}
              </li>
              <li>
                <strong>Détails supplémentaires :</strong> {request.additionalDetails}
              </li>
              <li>
                <strong>Justificatif :</strong>{" "}
                {request.justification ? (
                  <a
                    href={request.justification}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Voir le justificatif
                  </a>
                ) : (
                  "Aucun justificatif fourni."
                )}
              </li>
              <li>
                <strong>Statut actuel :</strong>{" "}
                <span
                  className={`font-semibold ${
                    request.status === "Pending"
                      ? "text-yellow-600"
                      : request.status === "Approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {request.status}
                </span>
              </li>
            </ul>
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={`p-4 rounded-md ${
                request.status === "Approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Actions */}
          {request.status === "Pending" && (
            <div className="flex justify-center space-x-4">
              <Button
                label="Approuver"
                onClick={handleApprove}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              />
              <Button
                label="Rejeter"
                onClick={handleReject}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              />
            </div>
          )}
        </section>
      ) : (
        <p className="text-gray-500 py-40 text-center">Aucune demande sélectionnée.</p>
      )}

      {/* Bouton Retour */}
      <footer className="mt-6 text-center">
        <Button
          label="Retour à la gestion des retours"
          onClick={() => navigate("/return-management")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        />
      </footer>
    </div>
  );
};

export default ReturnApprovalPage;