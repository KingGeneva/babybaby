
import React from 'react';
import CategoryPage from '@/components/forum/components/category/CategoryPage';
import SEOHead from '@/components/common/SEOHead';

const ForumCategoryPage = () => {
  return (
    <>
      <SEOHead 
        title="Catégorie Forum | BabyBaby"
        description="Discussions par thématique sur notre forum. Échangez avec d'autres parents sur la grossesse, l'éveil de bébé et la parentalité."
        canonicalUrl="https://babybaby.app/forum/categories"
        keywords={["forum parents", "discussion parentalité", "communauté parents", "échange parents"]}
      />
      <CategoryPage />
    </>
  );
};

export default ForumCategoryPage;
