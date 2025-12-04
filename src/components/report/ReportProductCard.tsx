import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, ExternalLink, Award, Star } from 'lucide-react';
import type { Product } from '@/data/babyProductsReport';

interface ReportProductCardProps {
  product: Product;
  index: number;
}

const ReportProductCard: React.FC<ReportProductCardProps> = ({ product, index }) => {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { label: '🥇 #1', className: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-0' };
      case 2:
        return { label: '🥈 #2', className: 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 border-0' };
      case 3:
        return { label: '🥉 #3', className: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-0' };
      default:
        return { label: `#${rank}`, className: 'bg-muted' };
    }
  };

  const rankBadge = getRankBadge(product.rank);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className={`h-full overflow-hidden hover:shadow-xl transition-all duration-300 ${product.rank === 1 ? 'ring-2 ring-primary/50 shadow-lg' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Badge className={rankBadge.className}>{rankBadge.label}</Badge>
            {product.rank === 1 && (
              <Badge variant="outline" className="text-primary border-primary">
                <Award className="w-3 h-3 mr-1" />
                Recommandé
              </Badge>
            )}
          </div>
          
          {/* Product Image Placeholder */}
          <div className="relative w-full aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg mt-3 flex items-center justify-center overflow-hidden group">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-contain p-4"
                loading="lazy"
              />
            ) : (
              <div className="text-center p-4">
                <div className="text-4xl mb-2">📦</div>
                <p className="text-xs text-muted-foreground">Image à ajouter</p>
              </div>
            )}
            {product.rank === 1 && (
              <div className="absolute top-2 right-2">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
              </div>
            )}
          </div>

          <div className="space-y-1 mt-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.brand}</p>
            <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
            <p className="text-sm text-primary font-semibold">{product.tagline}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
            {product.description}
          </p>

          {product.price && (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">{product.price}</span>
              <span className="text-xs text-muted-foreground">CAD</span>
            </div>
          )}

          {/* Pros */}
          {product.pros && product.pros.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Points forts</p>
              <ul className="space-y-1">
                {product.pros.slice(0, 4).map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cons */}
          {product.cons && product.cons.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">À considérer</p>
              <ul className="space-y-1">
                {product.cons.slice(0, 2).map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <X className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Affiliate Link Button */}
          {product.affiliateLink ? (
            <Button asChild className="w-full mt-4" size="sm">
              <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer nofollow">
                <ExternalLink className="w-4 h-4 mr-2" />
                Voir le produit
              </a>
            </Button>
          ) : (
            <Button variant="outline" className="w-full mt-4" size="sm" disabled>
              <ExternalLink className="w-4 h-4 mr-2" />
              Lien à ajouter
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportProductCard;
