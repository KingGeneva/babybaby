import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { List } from 'lucide-react';
import type { ProductCategory } from '@/data/babyProductsReport';

interface ReportTableOfContentsProps {
  categories: ProductCategory[];
}

const ReportTableOfContents: React.FC<ReportTableOfContentsProps> = ({ categories }) => {
  const scrollToSection = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="sticky top-24">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <List className="w-5 h-5 text-primary" />
            Table des matières
          </CardTitle>
        </CardHeader>
        <CardContent>
          <nav aria-label="Table des matières">
            <ol className="space-y-2">
              {categories.map((category, index) => (
                <li key={category.id}>
                  <button
                    onClick={() => scrollToSection(category.slug)}
                    className="flex items-center gap-2 w-full text-left text-sm hover:text-primary transition-colors py-1"
                  >
                    <Badge variant="outline" className="w-6 h-6 flex items-center justify-center text-xs">
                      {index + 1}
                    </Badge>
                    <span className="truncate">{category.title}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => scrollToSection('conclusion')}
                  className="flex items-center gap-2 w-full text-left text-sm hover:text-primary transition-colors py-1"
                >
                  <Badge variant="outline" className="w-6 h-6 flex items-center justify-center text-xs">
                    ✓
                  </Badge>
                  <span>Conclusion</span>
                </button>
              </li>
            </ol>
          </nav>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportTableOfContents;
