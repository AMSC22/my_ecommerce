import React from 'react'
import Button from "./Button.tsx";

interface BannerProps {
    title: string;
    subtitle: string;
    image: string;
    cta?: {
      label: string;
      link: string;
    };
  }
  
  const Banner: React.FC<BannerProps> = ({ title, subtitle, image, cta }) => {
    return (
      <div
        className="relative h-[60vh] flex items-center justify-center"
        style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="text-center text-white bg-black bg-opacity-50 p-6 rounded-lg">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-lg">{subtitle}</p>
          {cta && (
            <Button
              label={cta.label}
              type="primary"
              onClick={() => (window.location.href = cta.link)}
            />
          )}
        </div>
      </div>
    );
  };
  
  export default Banner;