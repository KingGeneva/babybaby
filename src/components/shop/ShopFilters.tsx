import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Grid3X3, LayoutGrid, SlidersHorizontal } from "lucide-react";

interface ShopFiltersProps {
  productCount: number;
  gridCols: 3 | 4;
  setGridCols: (cols: 3 | 4) => void;
}

export const ShopFilters = ({ productCount, gridCols, setGridCols }: ShopFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
    >
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
          {productCount} produit{productCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Grid toggle - desktop only */}
        <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/50">
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-full transition-all ${
              gridCols === 3 ? 'bg-background shadow-sm' : ''
            }`}
            onClick={() => setGridCols(3)}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-full transition-all ${
              gridCols === 4 ? 'bg-background shadow-sm' : ''
            }`}
            onClick={() => setGridCols(4)}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter button */}
        <Button 
          variant="outline" 
          className="gap-2 rounded-full border-border/50 hover:border-primary/50"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
        </Button>
      </div>
    </motion.div>
  );
};
