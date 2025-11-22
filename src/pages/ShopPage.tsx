import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import SEOHead from "@/components/common/SEOHead";
import { ShopProductCard } from "@/components/shop/ShopProductCard";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { fetchShopifyProducts } from "@/lib/shopify";
import type { ShopifyProduct } from "@/lib/shopify";
import { Loader2, ShoppingBag } from "lucide-react";

const ShopPage = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await fetchShopifyProducts(20);
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

  return (
    <MainLayout>
      <SEOHead
        title="Boutique - Produits pour bébés | BabyBaby"
        description="Découvrez notre sélection de produits pour bébés soigneusement choisis pour accompagner votre enfant dans ses premiers mois."
        canonicalUrl="https://babybaby.app/boutique"
      />

      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/5 to-background">
        {/* Hero Section */}
        <section className="relative py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
          
          <div className="container mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <ShoppingBag className="w-12 h-12 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Notre Boutique
                </h1>
              </div>
              
              <p className="text-lg md:text-xl text-muted-foreground">
                Des produits de qualité pour accompagner bébé dans ses premiers moments
              </p>

              <div className="flex justify-center pt-4">
                <CartDrawer />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Chargement des produits...</span>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20 space-y-4"
              >
                <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto" />
                <h2 className="text-2xl font-semibold">Aucun produit disponible</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Notre boutique sera bientôt remplie de produits merveilleux pour votre bébé. 
                  Revenez nous voir prochainement !
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ShopProductCard
                    key={product.node.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ShopPage;
