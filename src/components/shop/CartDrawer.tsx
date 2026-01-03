import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ExternalLink, Loader2, ShoppingBag, Sparkles } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    items, 
    isLoading, 
    updateQuantity, 
    removeItem, 
    createCheckout
  } = useCartStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  const handleCheckout = async () => {
    try {
      await createCheckout();
      const url = useCartStore.getState().checkoutUrl;
      if (url) {
        window.open(url, '_blank');
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error("Erreur lors de la création du panier");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative h-12 w-12 rounded-full border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
        >
          <ShoppingCart className="h-5 w-5 text-primary" />
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2"
              >
                <Badge className="h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground font-bold shadow-lg">
                  {totalItems}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-background/95 backdrop-blur-xl border-l border-border/50">
        <SheetHeader className="flex-shrink-0 pb-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl">Mon Panier</SheetTitle>
              <SheetDescription>
                {totalItems === 0 ? "Votre panier est vide" : `${totalItems} article${totalItems !== 1 ? 's' : ''}`}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-secondary/30 flex items-center justify-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">Panier vide</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Découvrez nos produits pour bébé
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  className="mt-4"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Continuer mes achats
                </Button>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Scrollable items area */}
              <div className="flex-1 overflow-y-auto pr-2 min-h-0 space-y-4">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div 
                      key={item.variantId}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
                    >
                      <div className="w-20 h-20 bg-secondary/20 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img
                            src={item.product.node.images.edges[0].node.url}
                            alt={item.product.node.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-medium truncate text-foreground">
                            {item.product.node.title}
                          </h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                            onClick={() => removeItem(item.variantId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {item.selectedOptions.length > 0 && item.variantTitle !== "Default Title" && (
                          <p className="text-xs text-muted-foreground">
                            {item.selectedOptions.map(option => option.value).join(' • ')}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-primary">
                            {parseFloat(item.price.amount).toFixed(2)} €
                          </p>
                          
                          <div className="flex items-center gap-2 bg-muted/50 rounded-full p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Fixed checkout section */}
              <div className="flex-shrink-0 space-y-4 pt-6 border-t border-border/50 bg-background mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Sous-total</span>
                    <span>{totalPrice.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Livraison</span>
                    <span>Calculée au checkout</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/30">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {totalPrice.toFixed(2)} €
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg" 
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Préparation...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Passer commande
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Paiement sécurisé via Shopify
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
