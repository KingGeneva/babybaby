
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, BookOpen, Gift, LayoutDashboard, LogOut, Store, Shield, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface MobileMenuProps {
  isOpen: boolean;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const MobileMenu = ({ isOpen, isDropdownOpen, toggleDropdown }: MobileMenuProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          id="mobile-navigation"
          role="navigation"
          aria-label="Menu principal"
          className="md:hidden bg-background border-y border-border shadow-premium overflow-hidden z-50"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && (
              <div className="border-b border-border mb-2 pb-2">
                <h3 className="px-3 py-2 text-sm font-medium text-muted-foreground">Mon compte</h3>
                <Link
                  to="/parental-dashboard"
                  className="flex min-h-11 items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Tableau de bord
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex min-h-11 items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Administration
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="w-full min-h-11 text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </button>
              </div>
            )}
            
            <Link
              to="/tools"
              className="block min-h-11 px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted"
            >
              Outils
            </Link>
            <Link
              to="/articles"
              className="block min-h-11 px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted"
            >
              Articles
            </Link>
            <Link
              to="/meilleurs-produits-bebe-2026"
              className="block min-h-11 px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted"
            >
              Meilleurs Produits 2026
            </Link>
            <Link
              to="/contests"
              className="block min-h-11 px-3 py-3 rounded-md text-base font-medium text-foreground hover:bg-muted"
            >
              Concours
            </Link>
            
            
            {user && (
              <Link
                to="/courses"
                className="flex min-h-11 items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Cours
              </Link>
            )}

            <div>
              <button
                type="button"
                onClick={toggleDropdown}
                aria-expanded={isDropdownOpen}
                className="flex w-full min-h-11 justify-between items-center px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
              >
                <span>Ressources</span>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={16} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-6 space-y-1"
                  >
                    <Link
                      to="/ebooks"
                      className="block min-h-11 px-3 py-3 rounded-md text-sm font-medium text-foreground hover:bg-muted"
                    >
                      E-books & Guides
                    </Link>
                    <Link
                      to="/favoris"
                      className="flex min-h-11 items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Favoris
                    </Link>
                    <Link
                      to="/free-offers"
                      className="flex min-h-11 items-center px-3 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Offres Gratuites
                    </Link>
                    <Link
                      to="/community"
                      className="block min-h-11 px-3 py-3 rounded-md text-sm font-medium text-foreground hover:bg-muted"
                    >
                      Communauté
                    </Link>
                    <Link
                      to="/faq"
                      className="block min-h-11 px-3 py-3 rounded-md text-sm font-medium text-foreground hover:bg-muted"
                    >
                      FAQ
                    </Link>
                    <Link
                      to="/about"
                      className="block min-h-11 px-3 py-3 rounded-md text-sm font-medium text-foreground hover:bg-muted"
                    >
                      À propos
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
