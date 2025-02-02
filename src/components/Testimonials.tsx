import React from 'react';
import Card from './Card.tsx';

interface Testimonial {
  id: number;
  name: string;
  comment: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  return (
    <section className="py-12 px-4 bg-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6">Ce que disent nos clients</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            title={testimonial.name}
            description={testimonial.comment}
            image="https://via.placeholder.com/150" // Exemple d'avatar
            link="#"
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;