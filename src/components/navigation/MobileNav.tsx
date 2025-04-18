
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface MobileNavProps {
  isOpen: boolean;
}

export const MobileNav = ({ isOpen }: MobileNavProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white/80 backdrop-blur-lg shadow-lg overflow-hidden"
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

            <div>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDropdownOpen(!isDropdownOpen);
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

              <MobileResourcesDropdown isOpen={isDropdownOpen} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const MobileResourcesDropdown = ({ isOpen }: { isOpen: boolean }) => (
  <AnimatePresence>
    {isOpen && (
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
);
