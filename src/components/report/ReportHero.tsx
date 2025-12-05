import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, BookOpen, Snowflake, Leaf, Cpu } from 'lucide-react';
import { introContent, reportMetadata, productCategories } from '@/data/babyProductsReport';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  snowflake: Snowflake,
  leaf: Leaf,
  cpu: Cpu,
};

const ReportHero: React.FC = () => {
  const totalProducts = productCategories.reduce((acc, cat) => acc + cat.products.length, 0);
  const readingTime = Math.ceil(15000 / 200); // ~15000 words / 200 wpm

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
      
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <Badge variant="secondary" className="px-3 py-1">
              <Clock className="w-3 h-3 mr-1" />
              {readingTime} min de lecture
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <BookOpen className="w-3 h-3 mr-1" />
              {productCategories.length} catégories • {totalProducts} produits
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {introContent.mainTitle}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-6">
            {introContent.subtitle}
          </p>

          {/* Introduction */}
          <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto">
            {introContent.introduction}
          </p>

          {/* Key Factors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {introContent.keyFactors.map((factor, index) => {
              const IconComponent = iconMap[factor.icon] || Leaf;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{factor.title}</h3>
                      <p className="text-sm text-muted-foreground">{factor.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReportHero;
