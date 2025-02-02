import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Delivery {
  id: number;
  product: string;
  deliveryStatus: string;
  buyerAddress: string;
  sellerAddress: string;
  currentLocation: [number, number];
  destination: [number, number];
  criticalSteps: string[];
  stepIndex: number;
}

const DeliveryTrackingPage: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simuler un appel API pour récupérer les livraisons
    const fetchDeliveries = async () => {
      const mockDeliveries: Delivery[] = [
        {
          id: 1,
          product: "Smartphone XYZ",
          deliveryStatus: "En transit",
          buyerAddress: "123 Rue de Paris, France",
          sellerAddress: "45 Boulevard Haussmann, France",
          currentLocation: [48.8566, 2.3522], // Coordonnées de Paris
          destination: [48.866667, 2.333333], // Coordonnées approximatives
          criticalSteps: ["Préparé", "Expédié", "En transit", "Livré"],
          stepIndex: 2,
        },
        {
          id: 2,
          product: "Casque Bluetooth ABC",
          deliveryStatus: "Livré",
          buyerAddress: "10 Avenue des Champs, France",
          sellerAddress: "20 Rue Saint-Honoré, France",
          currentLocation: [48.867, 2.331], // Coordonnées finales
          destination: [48.867, 2.331],
          criticalSteps: ["Préparé", "Expédié", "En transit", "Livré"],
          stepIndex: 3,
        },
      ];
      setDeliveries(mockDeliveries);
    };

    fetchDeliveries();
  }, []);

  const handleRefresh = () => {
    setMessage("Données mises à jour !");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Suivi des livraisons</h1>
        <p className="text-gray-500">Suivez vos produits en temps réel sur la carte.</p>
        {message && <p className="text-green-600 mt-2">{message}</p>}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Liste des livraisons */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Mes Livraisons</h2>
          {deliveries.length === 0 ? (
            <p className="text-gray-500">Aucune livraison en cours.</p>
          ) : (
            <ul className="space-y-4">
              {deliveries.map((delivery) => (
                <li
                  key={delivery.id}
                  className={`border rounded-md p-4 shadow-md cursor-pointer hover:bg-gray-50 ${
                    selectedDelivery?.id === delivery.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedDelivery(delivery)}
                >
                  <h3 className="font-bold">{delivery.product}</h3>
                  <p>
                    Statut :{" "}
                    <span
                      className={`font-bold ${
                        delivery.deliveryStatus === "Livré"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {delivery.deliveryStatus}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Destinataire : {delivery.buyerAddress}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Carte */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Carte</h2>
          {selectedDelivery ? (
            <MapContainer
              center={selectedDelivery.currentLocation}
              zoom={13}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Marqueur de la position actuelle */}
              <Marker position={selectedDelivery.currentLocation}>
                <Popup>
                  Position actuelle : {selectedDelivery.product}
                </Popup>
              </Marker>
              {/* Marqueur de la destination */}
              <Marker position={selectedDelivery.destination}>
                <Popup>Destination : {selectedDelivery.buyerAddress}</Popup>
              </Marker>
              {/* Ligne entre l'emplacement actuel et la destination */}
              <Polyline
                positions={[selectedDelivery.currentLocation, selectedDelivery.destination]}
                color="blue"
              />
            </MapContainer>
          ) : (
            <p className="text-gray-500">Cliquez sur une livraison pour la suivre sur la carte.</p>
          )}
        </div>
      </div>

      {/* Suivi des étapes */}
      {selectedDelivery && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Suivi des étapes</h2>
          <div className="flex gap-4 items-center">
            {selectedDelivery.criticalSteps.map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-full border-2 ${
                  index <= selectedDelivery.stepIndex
                    ? "border-green-500 bg-green-100"
                    : "border-gray-300 bg-gray-100"
                }`}
              >
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="mt-8 text-center">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
          onClick={() => setSelectedDelivery(null)}
        >
          Réinitialiser la carte
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-4"
          onClick={handleRefresh}
        >
          Rafraîchir
        </button>
      </footer>
    </div>
  );
};

export default DeliveryTrackingPage;
