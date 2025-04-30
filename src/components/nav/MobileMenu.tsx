
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const MobileMenu = ({ isOpen, isDropdownOpen, toggleDropdown }: MobileMenuProps) => {
  const { user } = useAuth();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
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
              to="/quiz"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              Quiz & Tests
            </Link>
            
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
