import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/components/layout/MainLayout";
import SEOHead from "@/components/common/SEOHead";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { 
  Loader2, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronLeft, 
  Check, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

const ProductDetailPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        const fetchedProduct = await fetchProductByHandle(handle);
        setProduct(fetchedProduct);
        
        if (fetchedProduct?.variants?.edges?.length > 0) {
          setSelectedVariant(fetchedProduct.variants.edges[0].node);
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!selectedVariant || !product) return;

    const shopifyProduct: ShopifyProduct = {
      node: product
    };

    addItem({
      product: shopifyProduct,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions || []
    });

    toast.success("Ajouté au panier ✨", {
      description: `${product.title} x ${quantity}`
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.title,
        url: window.location.href
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié !");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Chargement du produit...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Produit non trouvé</h1>
            <Link to="/boutique">
              <Button>Retour à la boutique</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const images = product.images?.edges || [];
  const price = parseFloat(selectedVariant?.price?.amount || product.priceRange.minVariantPrice.amount);

  const breadcrumbItems = [
    { name: "Accueil", url: "https://babybaby.app/" },
    { name: "Boutique", url: "https://babybaby.app/boutique" },
    { name: product.title, url: `https://babybaby.app/boutique/${handle}` },
  ];

  return (
    <MainLayout>
      <SEOHead
        title={`${product.title} | Boutique BabyBaby`}
        description={product.description?.slice(0, 160) || `Découvrez ${product.title} dans notre boutique BabyBaby`}
        canonicalUrl={`https://babybaby.app/boutique/${handle}`}
      />
      
      <BreadcrumbSchema items={breadcrumbItems} />
      
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "description": product.description,
            "image": images[0]?.node?.url,
            "offers": {
              "@type": "Offer",
              "price": price,
              "priceCurrency": selectedVariant?.price?.currencyCode || "EUR",
              "availability": selectedVariant?.availableForSale 
                ? "https://schema.org/InStock" 
                : "https://schema.org/OutOfStock"
            }
          })}
        </script>
      </Helmet>

      {/* Floating Cart */}
      <div className="fixed bottom-8 right-8 z-50">
        <CartDrawer />
      </div>

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link to="/boutique">
              <Button variant="ghost" className="gap-2 hover:bg-primary/5">
                <ChevronLeft className="w-4 h-4" />
                Retour à la boutique
              </Button>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Images Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/20 to-muted/30 border border-border/50">
                <AnimatePresence mode="wait">
                  {images[selectedImage] ? (
                    <motion.img
                      key={selectedImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      src={images[selectedImage].node.url}
                      alt={images[selectedImage].node.altText || product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Sparkles className="w-20 h-20 text-muted-foreground/30" />
                    </div>
                  )}
                </AnimatePresence>

                {/* Like button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 right-4 h-12 w-12 rounded-full bg-background/90 hover:bg-background shadow-lg"
                  onClick={() => {
                    setIsLiked(!isLiked);
                    toast.success(isLiked ? "Retiré des favoris" : "Ajouté aux favoris 💕");
                  }}
                >
                  <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                </Button>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border/50 hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img.node.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              {/* Title & Price */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {product.title}
                </h1>
                
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-primary">
                    {price.toFixed(2)} €
                  </span>
                  {selectedVariant?.availableForSale ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <Check className="w-3 h-3 mr-1" />
                      En stock
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Rupture de stock</Badge>
                  )}
                </div>
              </div>

              {/* Variants */}
              {product.options && product.options.length > 0 && product.options[0].values.length > 1 && (
                <div className="space-y-4">
                  {product.options.map((option: any) => (
                    <div key={option.name} className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        {option.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value: string) => {
                          const isSelected = selectedVariant?.selectedOptions?.some(
                            (opt: any) => opt.name === option.name && opt.value === value
                          );
                          return (
                            <button
                              key={value}
                              onClick={() => {
                                const variant = product.variants.edges.find((v: any) =>
                                  v.node.selectedOptions.some(
                                    (opt: any) => opt.name === option.name && opt.value === value
                                  )
                                );
                                if (variant) setSelectedVariant(variant.node);
                              }}
                              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quantité</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 p-1 rounded-full bg-muted/50 border border-border/50">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 h-14 text-lg font-semibold gap-2"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 w-14"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                {[
                  { icon: Truck, label: "Livraison rapide" },
                  { icon: Shield, label: "Paiement sécurisé" },
                  { icon: RotateCcw, label: "Retours gratuits" },
                ].map((feature) => (
                  <div key={feature.label} className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-3 pt-6 border-t border-border/50">
                  <h3 className="font-semibold text-lg">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
