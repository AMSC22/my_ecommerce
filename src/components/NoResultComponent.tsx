import React from "react";

interface NoResultComponentProps {
  query?: string;
}

const NoResultComponent: React.FC<NoResultComponentProps> = ({
  query = "",
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10">
      <div className="text-yellow-500 text-5xl mb-4">🔍</div>
      <p className="text-lg text-gray-700 mb-2">
        Aucun résultat trouvé pour "<span className="font-semibold">{query}</span>".
      </p>
      <p className="text-sm text-gray-500">
        Essayez d'élargir vos critères de recherche ou vérifiez l'orthographe.
      </p>
    </div>
  );
};

export default NoResultComponent;