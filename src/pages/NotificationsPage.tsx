import React, { useState } from "react";
import Button from "../components/Button.tsx";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Commande validée",
      message: "Votre commande #12345 a été validée avec succès.",
      type: "success",
      read: false,
      timestamp: "10:00 AM",
    },
    {
      id: 2,
      title: "Produit ajouté",
      message: "Un produit a été ajouté à votre panier.",
      type: "info",
      read: true,
      timestamp: "11:00 AM",
    },
    {
      id: 3,
      title: "Erreur de paiement",
      message: "Le paiement pour votre commande #54321 a échoué.",
      type: "error",
      read: false,
      timestamp: "12:30 PM",
    },
    { id: 4, title: "Commande confirmée", message: "Votre commande #12345 a été confirmée.", type: "error", timestamp: "10/01/2025 09:00", read: false },
    { id: 5, title: "Produit validé", message: "Votre produit 'Smartphone XYZ' a été approuvé.", type: "success", timestamp: "09/01/2025 15:30", read: true },
    { id: 6, title: "Nouveau message", message: "Vous avez reçu un nouveau message de John Doe.", type: "info", timestamp: "09/01/2025 10:20", read: false },
  ]);

  // Marquer une notification comme lue
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  // Supprimer une notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  // Supprimer toutes les notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen shadow-md rounded-md">
    {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Mes Notifications</h1>
        {/* Actions globales */}
        {notifications.length > 0 && (
        <div className="flex justify-between mb-6">
            <Button
            label="Tout marquer comme lu"
            onClick={markAllAsRead}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            />
            <Button
            label="Tout supprimer"
            onClick={clearAllNotifications}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            />
        </div>
        )}
      </header>

      {/* Notifications non lues */}
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">Aucune notification non lue.</p>
      ) : (
        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Notifications non lues</h2>
          {notifications.filter((notif) => !notif.read).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-md shadow-md flex justify-between items-center ${
                notification.read ? "bg-white" : "bg-blue-50"
              }`}
            >
              <div>
                <h2 className={`font-bold ${getTextColor(notification.type)}`}>
                  {notification.title}
                </h2>
                <p className="text-gray-600">{notification.message}</p>
                <small className="text-gray-500">{notification.timestamp}</small>
              </div>
              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <Button
                    label="Marquer comme lue"
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-600 border border-blue-600 px-2 py-1 rounded-md"
                  />
                )}
                <Button
                  label="Supprimer"
                  onClick={() => deleteNotification(notification.id)}
                  type="danger"
                  className="text-white bg-red-500 px-2 py-1 rounded-md"
                />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Notifications lues */}
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500">Aucune notification lue.</p>
      ) : (
        <section className="space-y-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Notifications lues</h2>
          {notifications.filter((notif) => notif.read).map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-md shadow-md flex justify-between items-center ${
                notification.read ? "bg-white" : "bg-blue-50"
              }`}
            >
              <div>
                <h2 className={`font-bold ${getTextColor(notification.type)}`}>
                  {notification.title}
                </h2>
                <p className="text-gray-600">{notification.message}</p>
                <small className="text-gray-500">{notification.timestamp}</small>
              </div>
              <div className="flex items-center space-x-2">
                {!notification.read && (
                  <Button
                    label="Marquer comme lue"
                    onClick={() => markAsRead(notification.id)}
                    className="text-blue-600 border border-blue-600 px-2 py-1 rounded-md"
                  />
                )}
                <Button
                  label="Supprimer"
                  onClick={() => deleteNotification(notification.id)}
                  type="danger"
                  className="text-white bg-red-500 px-2 py-1 rounded-md"
                />
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

// Fonction utilitaire pour déterminer la couleur du texte en fonction du type
const getTextColor = (type: string) => {
  switch (type) {
    case "success":
      return "text-green-600";
    case "info":
      return "text-blue-600";
    case "warning":
      return "text-yellow-600";
    case "error":
      return "text-red-600";
    default:
      return "text-gray-800";
  }
};

export default NotificationsPage;
