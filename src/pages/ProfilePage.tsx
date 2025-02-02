import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.tsx";
import Tooltip from "../components/TooltipProps.tsx";
import Loader from "../components/Loader.tsx";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    pays: "",
    shopName: "",
    profileImage: "https://via.placeholder.com/150",
  });
  const [orders, setOrders] = useState([
    { id: 1, date: "2025-01-10", total: 120.5, status: "Livré" },
    { id: 2, date: "2025-01-08", total: 50.0, status: "En attente" },
  ]);
  const [payments, setPayments] = useState([
    { id: 1, date: "2025-01-10", amount: 120.5, status: "Réussi" },
    { id: 2, date: "2025-01-08", amount: 50.0, status: "Échoué" },
  ]);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [updatedData, setUpdatedData] = useState(userData);
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setUserData({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "0701234567",
        address: "123 Rue de Paris, France",
        pays: "Cameroun",
        shopName: role === "seller" ? "La Boutique de John" : "",
        profileImage: "https://via.placeholder.com/150",
      });
      setUpdatedData({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "0701234567",
        address: "123 Rue de Paris, France",
        pays: "Cameroun",
        shopName: role === "seller" ? "La Boutique de John" : "",
        profileImage: "https://via.placeholder.com/150",
      });
      setIsLoading(false);
    }, 1000);
  }, [role]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Prévisualiser l'image
    }
  };
  
  const handleSaveField = (field: string) => {
    setUserData({ ...userData, [field]: updatedData[field] });
    setEditingField(null);
    alert(`${field} mis à jour avec succès !`);
  };

  const renderField = (label: string, field: string, type = "text") => (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2">{label} :</label>
      {editingField === field ? (
        <div className="flex items-center gap-2">
          <input
            type={type}
            name={field}
            value={updatedData[field]}
            onChange={handleInputChange}
            className="flex-1 border rounded-md p-2"
          />
          <Button label="Enregistrer" onClick={() => handleSaveField(field)} type="primary" />
          <Button
            label="Annuler"
            onClick={() => {
              setEditingField(null);
              setUpdatedData(userData); // Réinitialiser les changements
            }}
            type="secondary"
          />
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <p>{userData[field]}</p>
          <Button label="Modifier" onClick={() => setEditingField(field)} type="secondary" />
        </div>
      )}
    </div>
  );

  if (isLoading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white shadow-md rounded-md">
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <p className="text-gray-500">Gérez vos informations personnelles ici</p>
        <div className="mt-4 flex justify-center space-x-4">
          <Button
            label="Acheteur"
            type={role === "buyer" ? "primary" : "secondary"}
            onClick={() => setRole("buyer")}
          />
          <Button
            label="Vendeur"
            type={role === "seller" ? "primary" : "secondary"}
            onClick={() => setRole("seller")}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image de profil */}
        <div className="flex flex-col items-center lg:col-span-1">
          <img
            src={userData.profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full border"
          />
          <Tooltip message="Téléchargez une nouvelle image de profil">
            <Button
              label="Changer la photo"
              type="secondary"
              className="mt-4"
              onClick={() => handleImageChange}
            />
          </Tooltip>
        </div>

        {/* Informations utilisateur */}
        <div className="lg:col-span-2">
          {renderField("Prénom", "firstName")}
          {renderField("Nom", "lastName")}
          {renderField("Email", "email", "email")}
          {renderField("Téléphone", "phone", "tel")}
          {renderField("Adresse", "address")}
          {renderField("Pays", "pays")}
          {role === "seller" && renderField("Nom de la boutique", "shopName")}
        </div>
      </div>

      {/* Sections supplémentaires */}
      <section className="mt-8">
        {/* Suivi des commandes */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Suivi des commandes</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-md p-4 shadow-md">
                <p><strong>Commande #{order.id}</strong> - {order.date}</p>
                <p>Montant total : {order.total} €</p>
                <p>Statut : <span className={order.status === "Livré" ? "text-green-600" : "text-yellow-600"}>{order.status}</span></p>
              </div>
            ))}
            <Button label="Voir tout" type="secondary" className="mt-2" onClick={() => navigate(role === "buyer" ? "/buyer-orders" : "/seller-orders")} />
          </div>
        </div>

        {/* Suivi des paiements */}
        <div>
          <h2 className="text-xl font-bold mb-4">Suivi des paiements</h2>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border rounded-md p-4 shadow-md">
                <p><strong>Paiement #{payment.id}</strong> - {payment.date}</p>
                <p>Montant : {payment.amount} €</p>
                <p>Statut : <span className={payment.status === "Réussi" ? "text-green-600" : "text-red-600"}>{payment.status}</span></p>
              </div>
            ))}
            <Button label="Voir tout" type="secondary" className="mt-2" onClick={() => navigate("/delivery-tracking") } />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
