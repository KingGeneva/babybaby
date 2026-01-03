import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Heart, Star } from "lucide-react";

export const ShopHero = () => {
  return (
    <section className="relative py-20 md:py-28 px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-primary/5 to-accent/10" />
      
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 w-16 h-16 rounded-full bg-secondary/40 blur-xl"
        animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-primary/20 blur-2xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-babybaby-pink/50 blur-lg"
        animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* Floating icons */}
      <motion.div
        className="absolute top-24 right-16 md:right-32 text-secondary"
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart className="w-8 h-8 fill-secondary/30" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-16 md:left-32 text-primary"
        animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Star className="w-6 h-6 fill-primary/30" />
      </motion.div>
      <motion.div
        className="absolute top-40 left-1/4 text-babybaby-cosmic"
        animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Sparkles className="w-5 h-5" />
      </motion.div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 text-secondary-foreground"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Sélection Premium pour Bébé</span>
          </motion.div>

          {/* Main title with icon */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
            >
              <ShoppingBag className="w-10 h-10 md:w-14 md:h-14 text-primary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold"
            >
              <span className="bg-gradient-to-r from-primary via-babybaby-cosmic to-secondary bg-clip-text text-transparent">
                La Boutique
              </span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Découvrez notre collection exclusive de produits soigneusement sélectionnés 
            pour accompagner votre bébé dans ses premiers moments de vie
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-6 pt-4"
          >
            {[
              { icon: Heart, text: "Qualité Premium" },
              { icon: Star, text: "Livraison Rapide" },
              { icon: Sparkles, text: "Garantie Satisfait" },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
