
import React from 'react';

const ArticleEmpty: React.FC = () => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">Aucun article ne correspond à votre recherche.</p>
    </div>
  );
};

export default ArticleEmpty;
