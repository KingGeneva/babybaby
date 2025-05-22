
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, Gift } from "lucide-react";
import { NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface ResourcesDropdownProps {
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

const ResourcesDropdown = ({ isOpen, onToggle }: ResourcesDropdownProps) => {
  return (
    <NavigationMenuItem className="relative resources-dropdown">
      <div
        onClick={onToggle}
        className={cn(
          navigationMenuTriggerStyle(), 
          "cursor-pointer",
          isOpen ? "bg-accent text-accent-foreground" : ""
        )}
      >
        <span className="flex items-center">
          Ressources
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-1 inline-flex"
          >
            <ChevronDown size={16} />
          </motion.div>
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-1 w-56 glass-card rounded-xl py-2 z-10 neu-shadow-sm"
          >
            <Link
              to="/ebooks"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              E-books & Guides
            </Link>
            <Link
              to="/free-offers"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic flex items-center"
            >
              <Gift className="h-4 w-4 mr-2" />
              Offres Gratuites
            </Link>
            <Link
              to="/community"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              Communauté
            </Link>
            <Link
              to="/faq"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              FAQ
            </Link>
            <Link
              to="/about"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              À propos
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </NavigationMenuItem>
  );
};

export default ResourcesDropdown;
