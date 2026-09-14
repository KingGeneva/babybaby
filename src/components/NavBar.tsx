
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./Logo";
import DesktopNav from "./nav/DesktopNav";
import MobileMenu from "./nav/MobileMenu";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleResources = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResourcesOpen(!isResourcesOpen);
  };

  // Effect to close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside resources dropdown
      if (isResourcesOpen && !target.closest('.resources-dropdown')) {
        setIsResourcesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isResourcesOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300",
        isScrolled 
          ? "bg-background/95 border-border backdrop-blur-md"
          : "bg-background border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center">
            <Logo size="md" className="hover-lift" />
          </Link>

          <DesktopNav 
            isResourcesOpen={isResourcesOpen}
            toggleResources={toggleResources}
          />

          <div className="flex items-center gap-2">
            {!user && (
              <Link to="/auth" className="hidden sm:block">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-primary/30 text-primary min-h-11"
                >
                  Se connecter
                </Button>
              </Link>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="min-h-11 min-w-11 rounded-full text-foreground md:hidden"
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
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
