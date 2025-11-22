import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import type { ShopifyProduct } from "@/lib/shopify";
import { toast } from "sonner";

interface ShopProductCardProps {
  product: ShopifyProduct;
  index: number;
}

export const ShopProductCard = ({ product, index }: ShopProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const { node } = product;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = parseFloat(node.priceRange.minVariantPrice.amount);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
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
    toast.success("Ajouté au panier", {
      description: node.title
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link to={`/boutique/${node.handle}`}>
        <Card 
          className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CardContent className="p-0">
            <div className="relative aspect-square overflow-hidden bg-secondary/20">
              {image ? (
                <motion.img
                  src={image.url}
                  alt={image.altText || node.title}
                  className="w-full h-full object-cover"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">
                {node.title}
              </h3>
              
              {node.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {node.description}
                </p>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-xl font-bold text-primary">
                  {node.priceRange.minVariantPrice.currencyCode} {price.toFixed(2)}
                </span>
                
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={!variant?.availableForSale}
                  className="gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Ajouter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};
