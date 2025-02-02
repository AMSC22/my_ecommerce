import React from "react";

interface StepProps {
  step: number; // Étape actuelle du processus (1 à 4)
}

const stepPhase = ["Panier", "Livraison", "Paiement", "Confirmation"];

const CommandProcess: React.FC<StepProps> = ({ step }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {stepPhase.map((phase, index) => {
        const isCurrentStep = index + 1 === step;
        const isCompleted = index + 1 < step;

        return (
          <React.Fragment key={index}>
            <div className="flex items-center">
              {/* Rond pour l'étape */}
              <span
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  isCurrentStep
                    ? "bg-blue-500 text-white"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-500"
                }`}
              >
                {index + 1}
              </span>
              {/* Texte de l'étape */}
              <span
                className={`ml-2 ${
                  isCurrentStep
                    ? "text-blue-500 font-bold"
                    : isCompleted
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {phase}
              </span>
            </div>

            {/* Barre de progression */}
            {index < stepPhase.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  isCompleted ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default CommandProcess;