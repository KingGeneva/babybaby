
import React from 'react';
import { Link } from 'react-router-dom';

interface StrollerItemProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  idealFor: string;
  productLink: string;
}

const StrollerItem: React.FC<StrollerItemProps> = ({
  title,
  price,
  description,
  features,
  idealFor,
  productLink,
}) => {
  return (
    <div className="mb-10 border-l-4 border-babybaby-cosmic pl-6 py-2">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="font-medium text-gray-700">Prix : {price}</p>
      <p className="mb-3">{description}</p>
      <p className="font-medium mb-1">
        {title.includes('Atouts') ? 'Atouts :' : 
         title.includes('Avantages') ? 'Avantages :' : 
         title.includes('Points forts') ? 'Points forts :' : 
         title.includes('Caractéristiques') ? 'Caractéristiques clés :' : 
         title.includes('Forces') ? 'Forces :' : 'Caractéristiques :'}
      </p>
      <ul className="list-disc ml-6 mb-3">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <p className="mb-2"><strong>Idéal pour :</strong> {idealFor}</p>
      <Link to={productLink} className="text-blue-600 hover:text-blue-800 font-medium">
        Voir le produit →
      </Link>
    </div>
  );
};

export default StrollerItem;
