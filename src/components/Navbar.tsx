import React, { useState, useEffect } from "react";
import { useCart } from "../contexts/CartContext.tsx";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Tooltip from "./TooltipProps.tsx";
import default_profil from "../assets/Images/default_profil.jpg";
import { countCart } from "../services/CartService.ts";
import { countWishlist } from "../services/WishlistService.ts";

interface NavbarProps {
  isLoggedIn: boolean;
  userProfilePicture?: string; // URL de la photo de profil
  status: string;
  onLogout: () => void;
  messages?: { id: number; text: string; time: string; isRead: boolean }[]; // Liste des messages
  notifications?: { id: number; text: string; time: string; isRead: boolean }[]; // Liste des notifications
}

const Navbar: React.FC<NavbarProps> = ({
  isLoggedIn,
  userProfilePicture = default_profil,
  status,
  onLogout,
  messages = [],
  notifications = [],
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMessagesDropdownOpen, setIsMessagesDropdownOpen] = useState(false);
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation(); // Pour détecter la page actuelle
  const navigate = useNavigate();
  const [wishlistCount, setwishlistCount] = useState<number>(0);
  const [cartCount, setcartCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const user_id = "6796bc4f387b9c8670791537"
  // Chargement des données de la liste des Souhaits
  useEffect(() => {
    const loadWishlists = async () => {
      try {
        setError(null);
        const allwishlists = await countWishlist([user_id]);
        setwishlistCount(allwishlists[0].total_products);
        const allcartCounts = await countCart([user_id]);
        setcartCount(allcartCounts[0].total_products);
        setError(null);
      } catch (error) {
        setError(error);
      }          
    };
    loadWishlists();
  }, []);

  messages = [{ id: 1, text: "string", time: "string", isRead: false },
    { id: 2, text: "stringstringstringstringstringstringstringstringstringstringstring", time: "string", isRead: true },
    { id: 3, text: "string", time: "string", isRead: false },
    { id: 4, text: "string", time: "string", isRead: true }
  ]
  // Animation de clignotement pour les nouvelles notifications/messages
  const unreadMessages = messages.filter((msg) => !msg.isRead).length;
  const unreadNotifications = notifications.filter((notif) => !notif.isRead).length;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Fermer le dropdown lorsqu'on clique ailleurs
  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(".dropdown")) {
        setIsProfileDropdownOpen(false);
        setIsMessagesDropdownOpen(false);
        setIsNotificationsDropdownOpen(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  const handleDropdown = (section: string)  => {
    if(section === "profile"){
      setIsProfileDropdownOpen(!isProfileDropdownOpen);
      setIsMessagesDropdownOpen(false);
      setIsNotificationsDropdownOpen(false);
    }
    else if(section === "message"){
      setIsProfileDropdownOpen(false);
      setIsMessagesDropdownOpen(!isMessagesDropdownOpen);
      setIsNotificationsDropdownOpen(false);
    }
    else if(section === "notification"){
      setIsProfileDropdownOpen(false);
      setIsMessagesDropdownOpen(false);
      setIsNotificationsDropdownOpen(!isNotificationsDropdownOpen);
    }
  };

  // Pages où la barre de recherche ne doit pas apparaître
  const hideSearchBarPages = [
    "/login",
    "/register",
    "/contact",
    "/about",
    "/cart",
    "/delivery",
    "/confirmation",
    "/payment",
    "/admin-dashboard",
    "/seller-dashboard",
    "/buyer-dashboard",
    "/message",
    "/notifications",
    "/favorite"
  ];
  
  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">MyShop</Link>
        </div>

        {/* Navigation links (Desktop) */}
        <nav className="hidden md:flex space-x-6">
          {[
            { to: "/", label: "Accueil" },
            { to: "/categories", label: "Catégories" },
            { to: "/about", label: "À propos" },
            { to: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-yellow-400 transition-colors ${
                location.pathname === link.to ? "text-yellow-400" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search bar */}
        {!hideSearchBarPages.includes(location.pathname) && (
          <div className="hidden md:flex items-center">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-2 px-3 w-64 rounded-l-md focus:outline-none text-black"
            />
            <button
              onClick={handleSearch}
              className="bg-yellow-400 px-4 py-2 rounded-r-md hover:bg-yellow-500"
            >
              Rechercher
            </button>
          </div>
        )}

        {/* Icons (Cart, Wishlist, Profile/Connection) */}
        <div className="flex items-center space-x-4">
          {/* Panier */}
          <Link to="/cart" className="relative hover:text-yellow-400">
            <Tooltip message="Votre panier d'achat" position="bottom">
              🛒
            </Tooltip>
            {cartCount > 0 && error != null && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Liste de souhaits */}
          <Link to="/wishlist" className="relative hover:text-yellow-400">
            <Tooltip message="Votre liste de souhaits" position="bottom">❤️</Tooltip>
            {wishlistCount  > 0 && error != null && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Messages */}
          {isLoggedIn && (
            <div className="relative dropdown">
              <div
                className={`relative cursor-pointer hover:text-yellow-400 ${
                  unreadMessages > 0 ? "animate-pulse" : ""
                }`}
                onClick={() => handleDropdown("message")}>
                <Tooltip message="Vos messages" position="bottom">✉️</Tooltip>
                {unreadMessages > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </div>
              {isMessagesDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-md rounded-md">
                  <div className="p-4 font-bold border-b">Messages</div>
                  <ul className="divide-y">
                    {messages.map((msg) => (
                      <li key={msg.id} className="p-2">
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-xs text-gray-400">{msg.time}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="text-center p-2">
                    <Link to="/message" className="text-blue-600">
                      Voir tous les messages
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications */}
          {isLoggedIn && (
            <div className="relative dropdown">
              <div
                className={`relative cursor-pointer hover:text-yellow-400 ${
                  unreadNotifications > 0 ? "animate-pulse" : ""
                }`}
                onClick={() => handleDropdown("notification")}
              >
                <Tooltip message="Vos notifications" position="bottom">🔔</Tooltip>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </div>
              {isNotificationsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-md rounded-md">
                  <div className="p-4 font-bold border-b">Notifications</div>
                  <ul className="divide-y">
                    {notifications.map((notif) => (
                      <li key={notif.id} className="p-2">
                        <p className="text-sm">{notif.text}</p>
                        <p className="text-xs text-gray-400">{notif.time}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="text-center p-2">
                    <Link to="/notifications" className="text-blue-600">
                      Voir toutes les notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profil ou Connexion */}
          {isLoggedIn ? (
            <div className="relative dropdown">
              <img
                src={userProfilePicture || "https://via.placeholder.com/40"}
                alt="Profil utilisateur"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => handleDropdown("profile")}
              />
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-md rounded-md">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Profil
                  </Link>
                  <Link
                    to="/favorites"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Favoris
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-200"
                  >
                    Paramètres
                  </Link>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-yellow-400">
              Connexion
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-blue-700 text-white px-4 py-3 space-y-3">
          <Link to="/" className="block hover:text-yellow-400">Accueil</Link>
          <Link to="/categories" className="block hover:text-yellow-400">Catégories</Link>
          <Link to="/about" className="block hover:text-yellow-400">À propos</Link>
          <Link to="/contact" className="block hover:text-yellow-400">Contact</Link>
          {!hideSearchBarPages.includes(location.pathname) && (
            <div className="flex items-center mt-4">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 px-3 w-full rounded-l-md focus:outline-none text-black"
              />
              <button
                onClick={handleSearch}
                className="bg-yellow-400 px-4 py-2 rounded-r-md hover:bg-yellow-500"
              >
                Rechercher
              </button>
            </div>
          )}
          {isLoggedIn ? (
            <button
              onClick={onLogout}
              className="block hover:text-yellow-400 transition-colors mt-4"
            >
              Déconnexion
            </button>
          ) : (
            <Link to="/login" className="block hover:text-yellow-400 mt-4">
              Connexion
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;