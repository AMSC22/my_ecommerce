import React, { useState, useEffect } from "react";
import Button from "../components/Button.tsx";

interface Message {
  id: number;
  sender: "user" | "other"; // "user" représente l'utilisateur actuel
  text: string;
  time: string;
  attachment?: string;
  isRead: boolean;
}

interface Product {
  id: number;
  name: string;
  image: string;
  unreadCount: number; // Nombre de messages non lus
}

const MessagingPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "other", text: "Bonjour, je suis intéressé par votre produit.", time: "10:00 AM", isRead: false },
    { id: 2, sender: "user", text: "Bonjour, merci de votre intérêt !", time: "10:05 AM", isRead: true },
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Produit A", image: "https://via.placeholder.com/50", unreadCount: 2 },
    { id: 2, name: "Produit B", image: "https://via.placeholder.com/50", unreadCount: 0 },
    { id: 3, name: "Produit C", image: "https://via.placeholder.com/50", unreadCount: 1 },
  ]);

  // Gérer les messages reçus en temps réel (simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const randomProduct = Math.floor(Math.random() * products.length);
        const updatedProduct = products[randomProduct];
        updatedProduct.unreadCount += 1;

        const newMessage: Message = {
          id: messages.length + 1,
          sender: "other",
          text: `Nouveau message pour ${updatedProduct.name}.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isRead: false,
        };

        setMessages((prev) => [...prev, newMessage]);
        setProducts((prev) =>
          prev.map((product) =>
            product.id === updatedProduct.id ? { ...product, unreadCount: updatedProduct.unreadCount } : product
          )
        );
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [messages, products]);

  const handleSendMessage = () => {
    if (messageInput.trim() === "" && !attachment) return;

    const newMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachment: attachment ? URL.createObjectURL(attachment) : undefined,
      isRead: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
    setAttachment(null);

    if (selectedProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === selectedProduct.id ? { ...product, unreadCount: 0 } : product
        )
      );
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, unreadCount: 0 } : p))
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Section gauche : Produits */}
      {!selectedProduct && (
        <div className="w-full md:w-64 bg-white border-r shadow-md">
          <header className="p-4 bg-gray-100 text-lg font-bold">Produits</header>
          <div className="p-4 space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`flex items-center p-2 rounded-lg cursor-pointer ${
                  product.id === selectedProduct?.id
                    ? "bg-blue-100 border border-blue-500"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleSelectProduct(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="flex-1">
                  <span
                    className={`${
                      product.unreadCount > 0 ? "font-bold" : ""
                    }`}
                  >
                    {product.name}
                  </span>
                  {product.unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {product.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section droite : Messages */}
      {selectedProduct && (
        <div className="flex flex-col flex-1">
          {/* En-tête */}
          <header className="p-4 bg-blue-600 text-white flex items-center">
            <Button
              label="Retour"
              onClick={() => setSelectedProduct(null)}
              className="bg-green-500 text-blue-600 px-4 py-2 rounded-lg"
            />
            <h1 className="text-lg font-bold flex-1 text-center">{selectedProduct.name}</h1>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-200">
            {messages
              .filter((message) => message.sender === "user" || message.sender === "other")
              .map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-800 border"
                    }`}
                  >
                    <p>{message.text}</p>
                    {message.attachment && (
                      <img
                        src={message.attachment}
                        alt="Pièce jointe"
                        className="mt-2 rounded-md w-full"
                      />
                    )}
                    <small className="text-xs text-gray-800 block text-right semi-bold">
                      {message.time}
                    </small>
                  </div>
                </div>
              ))}
          </div>

          {/* Zone de saisie */}
          <footer className="p-4 bg-white border-t flex items-center space-x-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Tapez un message..."
              className="flex-1 border rounded-lg p-2"
            />
            <input
              type="file"
              onChange={handleAttachmentChange}
              className="hidden"
              id="attachmentInput"
            />
            <label
              htmlFor="attachmentInput"
              className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg cursor-pointer"
            >
              Joindre
            </label>
            <Button
              label="Envoyer"
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            />
          </footer>
        </div>
      )}
    </div>
  );
};

export default MessagingPage;