import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.tsx";
import Card from "../components/Card.tsx";
import FormComponent from "../components/FormComponent.tsx";
import Banner from "../components/Banner.tsx";
import CurrencySelector from "../components/CurrencySelector.tsx";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [newsletterData, setNewsletterData] = useState({ email: "" });
  const [newsletterErrors, setNewsletterErrors] = useState<{ [key: string]: string }>({});

  const handleNewsletterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewsletterData({ ...newsletterData, [name]: value });
    setNewsletterErrors({ ...newsletterErrors, [name]: "" });
  };

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    // Validation simple
    if (!newsletterData.email) {
      errors.email = "L'email est requis.";
    } else if (!/\S+@\S+\.\S+/.test(newsletterData.email)) {
      errors.email = "Entrez un email valide.";
    }

    if (Object.keys(errors).length > 0) {
      setNewsletterErrors(errors);
      return;
    }

    // Simuler une inscription réussie
    console.log("Newsletter souscrite :", newsletterData);
    alert("Merci de vous être inscrit à notre newsletter !");
    setNewsletterData({ email: "" });
  };

  const Products = {
    product: [
    {
      id: 1,
      name: "Smartphone XYZ",
      description: "Description rapide du produit.",
      image: "https://via.placeholder.com/150",
      price: "$299.99",
      quantity: 2,
    },
    {
      id: 2,
      name: "Casque Bluetooth ABC",
      description: "Description rapide du produit.",
      image: "https://via.placeholder.com/150",
      price: "$89.99",
      quantity: 1,
    },
    {
      id: 3,
      name: "Souris Gamer Pro",
      description: "Description rapide du produit.",
      image: "https://via.placeholder.com/150",
      price: "$49.99",
      quantity: 3,
    },
  ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Bannière/Carrousel */}
      <section className="relative bg-gradient-to-r from-blue-500 to-blue-800 text-white h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Bienvenue sur MyShop, notre e-commerce diversifié</h1>
          <p className="text-lg">Découvrez nos produits, promotions et bien plus encore.</p>
          <Button label="Explorer maintenant" type="primary" onClick={() => navigate("/categories")} />
        </div>  
      </section>

      {/* Section des produits vedettes */}
      <section className="py-12 px-4 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">Produits Vedettes</h2>
        <div className="py-4"> <CurrencySelector /> </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Products.product.map(product => (
            <Card
              key={product.id}
              title={product.name}
              description={product.description}
              price= {`${product.price} €`}
              image={product.image}
              link={`/products/${product.id}`}
            />
          ))}
        </div>
      </section>

      {/* Formulaire d'inscription à la newsletter */}
      <section className="py-12 px-4 bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">Inscrivez-vous à notre Newsletter</h2>
        <div className="max-w-xl mx-auto">
          <FormComponent
            fields={[
              {
                name: "email",
                label: "E-mail",
                type: "email",
                placeholder: "Entrez votre e-mail",
              },
            ]}
            values={newsletterData}
            errors={newsletterErrors}
            onChange={handleNewsletterChange}
            onSubmit={handleNewsletterSubmit}
            submitButtonLabel="S'inscrire"
          />
        </div>
      </section>

      {/* Section des témoignages clients */}
      <section className="py-12 px-4 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">Ce que disent nos clients</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Card
            title="Client 1"
            description="Produit incroyable, service client au top !"
            image="https://via.placeholder.com/150"
            link="/testimonials"
          />
          <Card
            title="Client 2"
            description="Livraison rapide, qualité impeccable."
            image="https://via.placeholder.com/150"
            link="/testimonials"
          />
          <Card
            title="Client 3"
            description="Je recommande fortement !"
            image="https://via.placeholder.com/150"
            link="/testimonials"
          />
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 px-4 bg-blue-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à découvrir nos produits ?</h2>
        <Button label="Commencer maintenant" type="secondary" onClick={() => navigate("/categories")} />
      </section>
    </div>
  );
};

export default HomePage;
