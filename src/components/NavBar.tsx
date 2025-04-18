
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

const NavBar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Toggle dropdown resource menu
  const toggleResources = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResourcesOpen(!isResourcesOpen);
  };

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/tools"
              className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic transition-all"
            >
              Outils
            </Link>
            <Link
              to="/articles"
              className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic transition-all"
            >
              Articles
            </Link>
            <div className="relative">
              <a
                href="#"
                onClick={toggleResources}
                className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic transition-all flex items-center"
              >
                Ressources
                <motion.div
                  animate={{ rotate: isResourcesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-1"
                >
                  <ChevronDown size={16} />
                </motion.div>
              </a>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isResourcesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-1 w-48 bg-white/80 backdrop-blur-lg rounded-md shadow-lg py-1 z-10"
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
          </nav>

          {/* Login / Dashboard Button */}
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard">
                <Button
                  size="sm"
                  className="bg-babybaby-cosmic hover:bg-babybaby-cosmic/90"
                >
                  Tableau de bord
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-babybaby-cosmic text-babybaby-cosmic hover:bg-babybaby-cosmic/10"
                >
                  Se connecter
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-babybaby-cosmic md:hidden"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
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

              {/* Mobile Resources Dropdown */}
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
    </header>
  );
};

export default NavBar;
