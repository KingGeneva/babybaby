import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/components/layout/MainLayout";
import SEOHead from "@/components/common/SEOHead";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { ShopEmptyState } from "@/components/shop/ShopEmptyState";
import { ShopFilters } from "@/components/shop/ShopFilters";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { fetchShopifyProducts } from "@/lib/shopify";
import type { ShopifyProduct } from "@/lib/shopify";
import { Loader2 } from "lucide-react";

const ShopPage = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gridCols, setGridCols] = useState<3 | 4>(4);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchShopifyProducts(24);
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const breadcrumbItems = [
    { name: "Accueil", url: "https://babybaby.app/" },
    { name: "Boutique", url: "https://babybaby.app/boutique" },
  ];

  return (
    <MainLayout>
      <SEOHead
        title="Boutique Bébé - Produits Premium pour Nourrissons | BabyBaby"
        description="Découvrez notre sélection exclusive de produits pour bébés : vêtements, accessoires, jouets et équipements de qualité premium. Livraison rapide et garantie satisfait."
        canonicalUrl="https://babybaby.app/boutique"
      />
      
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            "name": "BabyBaby Boutique",
            "description": "Boutique en ligne de produits pour bébés - Qualité premium et livraison rapide",
            "url": "https://babybaby.app/boutique",
            "image": "https://babybaby.app/og-image.png",
            "priceRange": "€€",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "FR"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-background">
        {/* Hero Section */}
        <ShopHero />

        {/* Floating Cart Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <CartDrawer />
          </motion.div>
        </div>

        {/* Products Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 gap-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/20"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <span className="text-muted-foreground font-medium">
                  Chargement de la boutique...
                </span>
              </motion.div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <ShopEmptyState />
            ) : (
              <>
                <ShopFilters 
                  productCount={products.length} 
                  gridCols={gridCols}
                  setGridCols={setGridCols}
                />
                
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${
                  gridCols === 3 
                    ? 'lg:grid-cols-3' 
                    : 'lg:grid-cols-3 xl:grid-cols-4'
                } gap-6 md:gap-8`}>
                  {products.map((product, index) => (
                    <ShopProductCard
                      key={product.node.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ShopPage;
