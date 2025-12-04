import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import ReportProductCard from './ReportProductCard';
import ReportComparisonTable from './ReportComparisonTable';
import type { ProductCategory } from '@/data/babyProductsReport';

interface ReportCategorySectionProps {
  category: ProductCategory;
  index: number;
}

const ReportCategorySection: React.FC<ReportCategorySectionProps> = ({ category, index }) => {
  return (
    <section 
      id={category.slug} 
      className="scroll-mt-24"
      aria-labelledby={`category-${category.id}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        {/* Category Header */}
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="outline" className="text-primary border-primary">
            {index + 1}
          </Badge>
          <h2 
            id={`category-${category.id}`}
            className="text-2xl md:text-3xl font-bold"
          >
            {category.title}
          </h2>
        </div>

        <p className="text-lg text-muted-foreground mb-6 max-w-3xl">
          {category.description}
        </p>

        {/* Market Analysis */}
        {category.marketAnalysis && category.marketAnalysis.length > 0 && (
          <Card className="mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <h3 className="font-semibold text-lg">Analyse du marché</h3>
              </div>
              <ul className="space-y-3">
                {category.marketAnalysis.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Comparison Table */}
        {category.comparisonTable && (
          <div className="mb-8">
            <ReportComparisonTable
              headers={category.comparisonTable.headers}
              rows={category.comparisonTable.rows}
              title="Comparatif technique"
            />
          </div>
        )}

        {/* Products Grid */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">
            Top 3 : Meilleurs {category.title} 2026
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.products.map((product, prodIndex) => (
              <ReportProductCard 
                key={product.id} 
                product={product} 
                index={prodIndex} 
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="border-b border-border/50 my-12" />
    </section>
  );
};

export default ReportCategorySection;
