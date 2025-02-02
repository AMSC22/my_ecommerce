import React from 'react';
import Card from './Card.tsx';

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
  }
  
  interface FeaturedProductsProps {
    products: Product[];
  }
  
  const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products }) => {
    return (
      <section className="py-12 px-4 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">Produits Vedettes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              title={product.title}
              description={`Prix : $${product.price}`}
              image={product.image}
              link={`/product/${product.id}`}
            />
          ))}
        </div>
      </section>
    );
  };
  
  export default FeaturedProducts;