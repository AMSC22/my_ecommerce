// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Button from "../../components/Button.tsx";

// interface ReturnRequest {
//   id: number;
//   productName: string;
//   reason: string;
//   status: "Pending" | "Approved" | "Rejected";
//   date: string;
//   userType: "buyer" | "seller";
//   userName: string; // Nom de l'acheteur ou du vendeur lié au retour
// }

// const ReturnStatusPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
//   const [userType, setUserType] = useState<"buyer" | "seller">("buyer"); // Par défaut, affichage pour les acheteurs

//   // Simuler un fetch des données de retours
//   useEffect(() => {
//     const fetchReturnRequests = async () => {
//       // Exemple de données statiques
//       const mockData: ReturnRequest[] = [
//         {
//           id: 1,
//           productName: "Smartphone XYZ",
//           reason: "Produit défectueux",
//           status: "Pending",
//           date: "2025-01-10",
//           userType: "buyer",
//           userName: "Jean Dupont",
//         },
//         {
//           id: 2,
//           productName: "Casque Bluetooth ABC",
//           reason: "Ne correspond pas à la description",
//           status: "Approved",
//           date: "2025-01-08",
//           userType: "buyer",
//           userName: "Marie Curie",
//         },
//         {
//           id: 3,
//           productName: "Chargeur USB FastCharge",
//           reason: "Problème technique",
//           status: "Rejected",
//           date: "2025-01-07",
//           userType: "seller",
//           userName: "Alex Turing",
//         },
//       ];
//       setReturnRequests(mockData);
//     };

//     fetchReturnRequests();
//   }, []);

//   // Filtrer les retours par type d'utilisateur (acheteur ou vendeur)
//   const filteredRequests = returnRequests.filter(
//     (request) => request.userType === userType
//   );

//   return (
//     <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-md">
//       {/* En-tête */}
//       <header className="mb-6">
//         <h1 className="text-3xl font-bold text-center">Statut des retours</h1>
//         <p className="text-gray-600 text-center">
//           Consultez les statuts des demandes de retour soumises ou reçues.
//         </p>
//       </header>

//       {/* Sélection du type d'utilisateur */}
//       <div className="flex justify-center mb-6">
//         <Button
//           label="Acheteur"
//           onClick={() => setUserType("buyer")}
//           className={`px-4 py-2 rounded-md ${
//             userType === "buyer" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
//           }`}
//         />
//         <Button
//           label="Vendeur"
//           onClick={() => setUserType("seller")}
//           className={`ml-4 px-4 py-2 rounded-md ${
//             userType === "seller" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
//           }`}
//         />
//       </div>

//       {/* Liste des demandes de retour */}
//       <section className="space-y-4">
//         {filteredRequests.length > 0 ? (
//           filteredRequests.map((request) => (
//             <div
//               key={request.id}
//               className={`p-4 rounded-md shadow-md ${
//                 request.status === "Pending"
//                   ? "bg-yellow-100"
//                   : request.status === "Approved"
//                   ? "bg-green-100"
//                   : "bg-red-100"
//               }`}
//             >
//               <h2 className="text-xl font-bold">{request.productName}</h2>
//               <p>
//                 <strong>Date :</strong> {request.date}
//               </p>
//               <p>
//                 <strong>Nom associé :</strong> {request.userName}
//               </p>
//               <p>
//                 <strong>Raison :</strong> {request.reason}
//               </p>
//               <p>
//                 <strong>Statut :</strong>{" "}
//                 <span
//                   className={`font-semibold ${
//                     request.status === "Pending"
//                       ? "text-yellow-600"
//                       : request.status === "Approved"
//                       ? "text-green-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {request.status}
//                 </span>
//               </p>
//               <Button
//                 label="Voir plus de détails"
//                 onClick={() =>
//                   navigate("/return-approval", { state: { request } })
//                 }
//                 className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
//               />
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-600">
//             Aucune demande de retour trouvée.
//           </p>
//         )}
//       </section>

//       {/* Bouton Retour */}
//       <footer className="mt-6 text-center">
//         <Button
//           label="Retour à l'accueil"
//           onClick={() => navigate("/")}
//           className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
//         />
//       </footer>
//     </div>
//   );
// };

// export default ReturnStatusPage;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button.tsx";

interface ReturnRequest {
  id: number;
  productName: string;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
  userType: "buyer" | "seller";
  userName: string;
  justification?: string; // URL ou nom du fichier justificatif
}

const ReturnStatusPage: React.FC = () => {
  const navigate = useNavigate();
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [userType, setUserType] = useState<"buyer" | "seller">("buyer");

  useEffect(() => {
    const fetchReturnRequests = async () => {
      const mockData: ReturnRequest[] = [
        {
          id: 1,
          productName: "Smartphone XYZ",
          reason: "Produit défectueux",
          status: "Pending",
          date: "2025-01-10",
          userType: "buyer",
          userName: "Jean Dupont",
          justification: "https://example.com/justification1.pdf",
        },
        {
          id: 2,
          productName: "Casque Bluetooth ABC",
          reason: "Ne correspond pas à la description",
          status: "Approved",
          date: "2025-01-08",
          userType: "buyer",
          userName: "Marie Curie",
        },
      ];
      setReturnRequests(mockData);
    };

    fetchReturnRequests();
  }, []);

  const filteredRequests = returnRequests.filter(
    (request) => request.userType === userType
  );

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-md">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Statut des retours</h1>
        <p className="text-gray-600 text-center">
          Consultez les statuts des demandes de retour soumises ou reçues.
        </p>
      </header>

      {/* Sélection du type d'utilisateur */}
      <div className="flex justify-center mb-6">
        <Button
          label="Acheteur"
          onClick={() => setUserType("buyer")}
          className={`px-4 py-2 rounded-md ${
            userType === "buyer" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
        />
        <Button
          label="Vendeur"
          onClick={() => setUserType("seller")}
          className={`ml-4 px-4 py-2 rounded-md ${
            userType === "seller" ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
        />
      </div>

      {/* Liste des demandes de retour */}
      <section className="space-y-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`p-4 rounded-md shadow-md ${
                request.status === "Pending"
                  ? "bg-yellow-100"
                  : request.status === "Approved"
                  ? "bg-green-100"
                  : "bg-red-100"
              }`}
            >
              <h2 className="text-xl font-bold">{request.productName}</h2>
              <p>
                <strong>Date :</strong> {request.date}
              </p>
              <p>
                <strong>Nom associé :</strong> {request.userName}
              </p>
              <p>
                <strong>Raison :</strong> {request.reason}
              </p>
              <p>
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
              </p>
              <p>
                <strong>Statut :</strong>{" "}
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
              </p>
              <Button
                label="Voir plus de détails"
                onClick={() =>
                  navigate("/return-approval", { state: { request } })
                }
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            Aucune demande de retour trouvée.
          </p>
        )}
      </section>

      {/* Bouton Retour */}
      <footer className="mt-6 text-center">
        <Button
          label="Retour à l'accueil"
          onClick={() => navigate("/")}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
        />
      </footer>
    </div>
  );
};

export default ReturnStatusPage;