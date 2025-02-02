import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import Card from "../../components/Card.tsx";
import Button from "../../components/Button.tsx";
import Loader from "../../components/Loader.tsx";
import CommandProcess from "../../components/CommandProcess.tsx";

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"success" | "failure" | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [deliveryAgency, setDeliveryAgency] = useState<string | null>(null);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [deliveryTime, setDeliveryTime] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Liste des moyens de paiement
  const paymentMethods = [
    { id: 1, name: "Visa", image: "https://example.com/visa.png", apiEndpoint: "/api/payments/visa" },
    { id: 2, name: "MasterCard", image: "https://example.com/mastercard.png", apiEndpoint: "/api/payments/mastercard" },
    { id: 3, name: "PayPal", image: "https://example.com/paypal.png", apiEndpoint: "/api/payments/paypal" },
    { id: 4, name: "Orange Money", image: "https://example.com/orangemoney.png", apiEndpoint: "/api/payments/orange" },
    { id: 5, name: "MTN Mobile Money", image: "https://example.com/mtnmoney.png", apiEndpoint: "/api/payments/mtn" },
  ];

  // Récupérer les données transmises par la page Livraison
  useEffect(() => {
    if (location.state) {
      const { cartItems, deliveryAgency, deliveryPrice, deliveryTime, total } = location.state;
      setCartItems(cartItems || []);
      setDeliveryAgency(deliveryAgency || null);
      setDeliveryPrice(deliveryPrice || 0);
      setDeliveryTime(deliveryTime || null);
      setTotal(total || 0);
    }
  }, [location]);

  const config = {
    public_key: "YOUR_FLUTTERWAVE_PUBLIC_KEY",
    tx_ref: Date.now().toString(),
    amount: total,
    currency: "XAF",
    payment_options: "card, mobilemoney, ussd",
    customer: {
      email: "user@example.com",
      phone_number: "070********",
      name: "John Doe",
    },
    customizations: {
      title: "Paiement MyShop",
      description: "Paiement de votre commande MyShop",
      logo: "https://example.com/logo.png",
    },
  };

  const initiatePayment = useFlutterwave(config);

  const handlePayment = () => {
    if (!selectedPaymentMethod) {
      setErrorMessage("Veuillez sélectionner une méthode de paiement.");
      return;
    }
    setErrorMessage(null);
    setIsProcessing(true);

    initiatePayment({
      callback: (response) => {
        setIsProcessing(false);
        if (response.status === "successful") {
          setPaymentStatus("success");
          navigate("/confirmation", {
            state: {
              cartItems,
              deliveryAgency,
              deliveryPrice,
              deliveryTime,
              total,
              paymentMethod: selectedPaymentMethod,
            },
          });
        } else {
          setPaymentStatus("failure");
        }
        closePaymentModal();
      },
      onClose: () => {
        setIsProcessing(false);
      },
    });
  };

  if (isProcessing) return <Loader />;

  const subTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxes = subTotal * 0.2;

  return (
    <div className="p-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Paiement</h1>
        <CommandProcess step={currentStep} />
      </header>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-6">
          {errorMessage}
        </div>
      )}

      {/* Options de paiement */}
      <section className="border p-4 rounded-md mb-6">
        <h2 className="text-lg font-bold mb-4">Méthodes de paiement</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              image={method.image}
              title={method.name}
              onActionClick={() => setSelectedPaymentMethod(method.name)}
              className={`cursor-pointer ${
                selectedPaymentMethod === method.name ? "border-blue-500" : "hover:border-gray-300"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Résumé de la commande */}
      <section className="border p-4 rounded-md mb-6">
        <h2 className="text-lg font-bold mb-4">Résumé de la commande</h2>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nom du produit</th>
              <th className="py-2 px-4 border-b">Quantité</th>
              <th className="py-2 px-4 border-b">Prix</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b text-right">{item.quantity}</td>
                <td className="py-2 px-4 border-b text-right">{item.price.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="py-2 px-4 text-right font-bold">Sous-total :</td>
              <td className="py-2 px-4 text-right">{subTotal.toFixed(2)} €</td>
            </tr>
          </tfoot>

          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nom de l'Agence de Livraison</th>
              <th className="py-2 px-4 border-b">Temps de la Livraison</th>
              <th className="py-2 px-4 border-b">Frais de la Livraison</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">{deliveryAgency}</td>
              <td className="py-2 px-4 border-b text-right">{deliveryTime}</td>
              <td className="py-2 px-4 border-b text-right">{deliveryPrice.toFixed(2)} €</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="py-2 px-4 text-right font-bold">Sous-total :</td>
              <td className="py-2 px-4 text-right">{subTotal.toFixed(2)} €</td>
            </tr>
            <tr>
              <td colSpan={2} className="py-2 px-4 text-right font-bold">Taxes (20%) :</td>
              <td className="py-2 px-4 text-right">{taxes.toFixed(2)} €</td>
            </tr>
            <tr>
              <td colSpan={2} className="py-2 px-4 text-right font-bold">Frais de livraison :</td>
              <td className="py-2 px-4 text-right">{deliveryPrice.toFixed(2)} €</td>
            </tr>
            <tr>
              <td colSpan={2} className="py-2 px-4 text-right font-bold">Agence de livraison :</td>
              <td className="py-2 px-4 text-right">{deliveryAgency}</td>
            </tr>
            <tr>
              <td colSpan={2} className="py-2 px-4 text-right font-bold">Total :</td>
              <td className="py-2 px-4 text-right">{total.toFixed(2)} €</td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* Boutons d'action */}
      <footer className="flex justify-between">
        <Button
          label="Retour à la livraison"
          type="secondary"
          onClick={() => navigate("/delivery", { state: { cartItems, deliveryAgency, deliveryPrice, deliveryTime, total } })}
        />
        <Button
          label="Confirmer et payer"
          onClick={handlePayment}
        />
      </footer>
    </div>
  );
};

export default PaymentPage;
