
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./Logo";
import DesktopNav from "./nav/DesktopNav";
import MobileMenu from "./nav/MobileMenu";

const NavBar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleResources = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResourcesOpen(!isResourcesOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-sm backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <Logo size="md" />
          </Link>

          <DesktopNav 
            isResourcesOpen={isResourcesOpen}
            toggleResources={toggleResources}
          />

          <div className="flex items-center gap-2">
            {!user && (
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

      <MobileMenu 
        isOpen={isMenuOpen}
        isDropdownOpen={isDropdownOpen}
        toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
      />
    </header>
  );
};

export default NavBar;
