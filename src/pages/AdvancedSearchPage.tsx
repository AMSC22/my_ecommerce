import React, { useState } from "react";
import Button from "../components/Button.tsx";
import Card from "../components/Card.tsx";
import Loader from "../components/Loader.tsx";

const AdvancedSearchPage: React.FC = () => {
  // État pour gérer les filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState("relevance");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Options de tri
  const sortOptions = [
    { value: "relevance", label: "Pertinence" },
    { value: "priceLowHigh", label: "Prix croissant" },
    { value: "priceHighLow", label: "Prix décroissant" },
    { value: "newest", label: "Nouveautés" },
  ];

  // Options de catégorie
  const categories = [
    "Électronique",
    "Mode",
    "Maison et Jardin",
    "Sport",
    "Beauté",
  ];

  // Simuler la recherche (remplacez par une API)
  const handleSearch = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          name: "Smartphone XYZ",
          description: "Un smartphone performant et abordable.",
          price: 299.99,
          image: "https://via.placeholder.com/150",
          rating: 4.5,
        },
        {
          id: 2,
          name: "Chaussures de Sport ABC",
          description: "Confortables et légères.",
          price: 59.99,
          image: "https://via.placeholder.com/150",
          rating: 4.8,
        },
      ];
      setResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategory("");
    setPriceRange([0, 1000]);
    setLocation("");
    setRating(null);
    setSortOption("relevance");
    setResults([]);
  };

  return (
    <div className="p-6">
      {/* En-tête */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Recherche Avancée</h1>
        <p className="text-gray-600">Trouvez exactement ce que vous cherchez.</p>
      </header>

      {/* Filtres avancés */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Filtres</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Champ de recherche */}
          <div>
            <label className="block font-semibold">Mot-clé</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="border rounded-md p-2 w-full"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block font-semibold">Catégorie</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Plage de prix */}
          <div>
            <label className="block font-semibold">Prix (min - max)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) =>
                  setPriceRange([+e.target.value, priceRange[1]])
                }
                placeholder="Min"
                className="border rounded-md p-2 w-1/2"
              />
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], +e.target.value])
                }
                placeholder="Max"
                className="border rounded-md p-2 w-1/2"
              />
            </div>
          </div>

          {/* Localisation */}
          <div>
            <label className="block font-semibold">Localisation</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Pays ou Ville"
              className="border rounded-md p-2 w-full"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block font-semibold">Évaluation minimale</label>
            <select
              value={rating ?? ""}
              onChange={(e) =>
                setRating(e.target.value ? +e.target.value : null)
              }
              className="border rounded-md p-2 w-full"
            >
              <option value="">Toutes les notes</option>
              {[3, 4, 5].map((rate) => (
                <option key={rate} value={rate}>
                  {rate} étoiles et plus
                </option>
              ))}
            </select>
          </div>

          {/* Tri */}
          <div>
            <label className="block font-semibold">Trier par</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded-md p-2 w-full"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Boutons */}
        <div className="mt-4 flex space-x-4">
          <Button label="Rechercher" onClick={handleSearch} />
          <Button
            label="Réinitialiser"
            type="secondary"
            onClick={handleResetFilters}
          />
        </div>
      </section>

      {/* Résultats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Résultats</h2>
        {isLoading ? (
          <Loader />
        ) : results.length === 0 ? (
          <p>Aucun résultat trouvé.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((result) => (
              <Card
                key={result.id}
                image={result.image}
                title={result.name}
                description={result.description}
                footer={`Prix : ${result.price.toFixed(2)} €`}
                onActionClick={() => console.log(`Voir plus : ${result.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdvancedSearchPage;
