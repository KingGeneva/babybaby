import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye, Sparkles } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

interface ShopProductCardProps {
  product: ShopifyProduct;
  index: number;
}

export const ShopProductCard = ({ product, index }: ShopProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const { node } = product;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!variant || !variant.availableForSale) {
      toast.error("Produit non disponible");
      return;
    }

    const cartItem = {
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions
    };
    
    addItem(cartItem);
    toast.success("Ajouté au panier ✨", {
      description: node.title
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Retiré des favoris" : "Ajouté aux favoris 💕");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Link to={`/boutique/${node.handle}`}>
        <Card 
          className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full bg-card/80 backdrop-blur-sm"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardContent className="p-0">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-secondary/20 to-muted/30">
              {image ? (
                <motion.img
                  src={image.url}
                  alt={image.altText || node.title}
                  className="w-full h-full object-cover"
                  animate={{ scale: isHovered ? 1.08 : 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary/30 to-primary/10">
                  <Sparkles className="w-16 h-16 text-muted-foreground/50" />
                </div>
              )}

              {/* Overlay on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Quick action buttons */}
              <motion.div 
                className="absolute top-4 right-4 flex flex-col gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-background/90 hover:bg-background shadow-lg backdrop-blur-sm"
                  onClick={handleLike}
                >
                  <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-10 w-10 rounded-full bg-background/90 hover:bg-background shadow-lg backdrop-blur-sm"
                >
                  <Eye className="w-5 h-5 text-muted-foreground" />
                </Button>
              </motion.div>

              {/* Add to cart button on hover */}
              <motion.div 
                className="absolute bottom-4 left-4 right-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={!variant?.availableForSale}
                  className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Ajouter au panier
                </Button>
              </motion.div>

              {/* Status badge */}
              {variant && !variant.availableForSale && (
                <Badge className="absolute top-4 left-4 bg-destructive/90 text-destructive-foreground">
                  Rupture de stock
                </Badge>
              )}
            </div>
            
            {/* Product info */}
            <div className="p-5 space-y-3">
              <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors">
                {node.title}
              </h3>
              
              {node.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {node.description}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-primary">
                    {price.toFixed(2)} €
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {node.priceRange.minVariantPrice.currencyCode}
                  </span>
                </div>
                
                {/* Mobile add to cart */}
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!variant?.availableForSale}
                  className="gap-2 md:hidden"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
