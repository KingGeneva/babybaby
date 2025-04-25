
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface ResourcesDropdownProps {
  isOpen: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

const ResourcesDropdown = ({ isOpen, onToggle }: ResourcesDropdownProps) => {
  return (
    <div className="relative">
      <a
        href="#"
        onClick={onToggle}
        className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic transition-all flex items-center"
      >
        Ressources
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1"
        >
          <ChevronDown size={16} />
        </motion.div>
      </a>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10"
          >
            <Link
              to="/ebooks"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic"
            >
              E-books & Guides
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
    </div>
  );
};

export default ResourcesDropdown;
