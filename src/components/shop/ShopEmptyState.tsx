import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Heart } from "lucide-react";

export const ShopEmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-20 px-4"
    >
      <div className="max-w-lg mx-auto space-y-8">
        {/* Animated illustration */}
        <div className="relative w-40 h-40 mx-auto">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-secondary/30 to-primary/10"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-primary/60" />
          </div>
          
          {/* Floating elements */}
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="p-2 rounded-full bg-secondary/30">
              <Heart className="w-5 h-5 text-secondary fill-secondary/50" />
            </div>
          </motion.div>
          <motion.div
            className="absolute -bottom-2 -left-2"
            animate={{ y: [0, 8, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="p-2 rounded-full bg-primary/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
          </motion.div>
        </div>

        {/* Text content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Notre boutique arrive bientôt
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nous préparons une sélection de produits exceptionnels pour accompagner 
            votre bébé dans ses premiers moments de vie. Revenez nous voir très bientôt !
          </p>
        </div>

        {/* Features preview */}
        <div className="grid grid-cols-3 gap-4 pt-8">
          {[
            { icon: ShoppingBag, label: "Produits de qualité" },
            { icon: Heart, label: "Avec amour" },
            { icon: Sparkles, label: "Pour bébé" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 border border-border/50"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground text-center">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
