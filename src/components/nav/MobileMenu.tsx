
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, BookOpen, Gift, LayoutDashboard, LogOut, Store } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const MobileMenu = ({ isOpen, isDropdownOpen, toggleDropdown }: MobileMenuProps) => {
  const { user, signOut } = useAuth();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="md:hidden glass-card mx-4 mt-2 overflow-hidden z-50"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user && (
              <div className="border-b border-gray-100 mb-2 pb-2">
                <h3 className="px-3 py-2 text-sm font-medium text-gray-500">Mon compte</h3>
                <Link
                  to="/parental-dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic flex items-center"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Tableau de bord
                </Link>
                <button
                  onClick={signOut}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Se déconnecter
                </button>
              </div>
            )}
            
            <Link
              to="/tools"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              Outils
            </Link>
            <Link
              to="/articles"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              Articles
            </Link>
            <Link
              to="/articles/meilleures-poussettes-2025"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              Meilleures Poussettes
            </Link>
            <Link
              to="/quiz"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              Quiz & Tests
            </Link>
            <Link
              to="/contests"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              Concours
            </Link>
            
            <a
              href="https://babybaby.boutique"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              <Store className="h-4 w-4 mr-2" />
              Boutique
            </a>
            
            {user && (
              <Link
                to="/courses"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic flex items-center"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Cours
              </Link>
            )}

            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toggleDropdown();
                }}
                className="flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
              >
                <span>Ressources</span>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight size={16} />
                </motion.div>
              </a>

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
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
                    >
                      E-books & Guides
                    </Link>
                    <Link
                      to="/free-offers"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic flex items-center"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Offres Gratuites
                    </Link>
                    <Link
                      to="/community"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
                    >
                      Communauté
                    </Link>
                    <Link
                      to="/faq"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
                    >
                      FAQ
                    </Link>
                    <Link
                      to="/about"
                      className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
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
