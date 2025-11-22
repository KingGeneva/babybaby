import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import SEOHead from "@/components/common/SEOHead";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/shop/CartDrawer";
import { storefrontApiRequest } from "@/lib/shopify";
import type { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

const ProductDetailPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        const productData = data?.data?.productByHandle;
        
        if (productData) {
          setProduct(productData);
          setSelectedVariant(productData.variants.edges[0]?.node);
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
    if (!product || !selectedVariant) return;

    const cartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions
    };
    
    addItem(cartItem);
    toast.success("Ajouté au panier", {
      description: product.title
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
          <Link to="/boutique">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la boutique
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const price = parseFloat(selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount);
  const images = product.images.edges;

  return (
    <MainLayout>
      <SEOHead
        title={`${product.title} | BabyBaby`}
        description={product.description}
        canonicalUrl={`https://babybaby.app/boutique/${product.handle}`}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/boutique">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour
              </Button>
            </Link>
            <CartDrawer />
          </div>

          {/* Product Content */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary/20">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="w-20 h-20 text-muted-foreground" />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image.node.url}
                        alt={image.node.altText || product.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {product.title}
                </h1>
                
                <div className="text-3xl font-bold text-primary">
                  {selectedVariant?.price.currencyCode || 'USD'} {price.toFixed(2)}
                </div>
              </div>

              {product.description && (
                <div className="prose prose-sm">
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              {product.options.length > 0 && (
                <div className="space-y-4">
                  {product.options.map((option) => (
                    <div key={option.name}>
                      <label className="text-sm font-medium mb-2 block">
                        {option.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const variant = product.variants.edges.find(v =>
                            v.node.selectedOptions.some(
                              opt => opt.name === option.name && opt.value === value
                            )
                          );
                          const isSelected = selectedVariant?.selectedOptions.some(
                            opt => opt.name === option.name && opt.value === value
                          );
                          
                          return (
                            <Button
                              key={value}
                              variant={isSelected ? "default" : "outline"}
                              onClick={() => variant && setSelectedVariant(variant.node)}
                            >
                              {value}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
              >
                <ShoppingCart className="w-5 h-5" />
                {selectedVariant?.availableForSale ? 'Ajouter au panier' : 'Non disponible'}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
