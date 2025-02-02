import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string>(" ");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
      setNewsletterError("Veuillez entrer une adresse e-mail valide.");
    }
  };
  

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* À propos */}
        <div>
          <h4 className="font-bold text-lg mb-3">À propos</h4>
          <p className="text-sm text-gray-300">
            MyShop est votre destination ultime pour une expérience d'achat
            diversifiée. Nous offrons des produits de qualité pour répondre à
            tous vos besoins.
          </p>
        </div>

        {/* Liens rapides */}
        <div>
          <h4 className="font-bold text-lg mb-3">Liens rapides</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link to="/" className="hover:text-yellow-400">Accueil</Link></li>
            <li><Link to="/categories" className="hover:text-yellow-400">Catégories</Link></li>
            <li><Link to="/about" className="hover:text-yellow-400">À propos</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-yellow-400">FAQ</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-yellow-400">Conditions générales</Link></li>
            <li><Link to="/subscriptions" className="hover:text-yellow-400">Abonnements</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-lg mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>📍 Adresse : 123 Rue du Commerce, Paris</li>
            <li>📞 Téléphone : +33 1 23 45 67 89</li>
            <li>
            <span className="text-2xl">📱</span>
                <a
                  href="https://wa.me/33123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  WhatsApp
                </a>
              </li>
            <li>
            <span className="text-2xl">📘</span> 
              <a
                  href="https://facebook.com/myshop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Facebook
                </a>
              </li>
            <li>📧 Email : support@myshop.com</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold text-lg mb-3">Abonnez-vous à notre newsletter</h4>
          {!isSubscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-2 px-3 rounded-md text-black"
              />
              {newsletterError && (
                <p className="text-red-500 text-sm">{newsletterError}</p>
              )}
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-md"
              >
                S'abonner
              </button>
            </form>
          ) : (
            <p className="text-yellow-400">
              Merci pour votre abonnement !
            </p>
          )}
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="mt-8 border-t border-gray-700 pt-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2025 - {new Date().getFullYear()} MyShop. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400"
            >
              Facebook
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400"
            >
              Twitter
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;