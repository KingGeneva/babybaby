
import { Link } from "react-router-dom";
import ResourcesDropdown from "./ResourcesDropdown";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User, BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DesktopNavProps {
  isResourcesOpen: boolean;
  toggleResources: (e: React.MouseEvent) => void;
}

const DesktopNav = ({ isResourcesOpen, toggleResources }: DesktopNavProps) => {
  const { user, signOut } = useAuth();

  return (
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
      <Link
        to="/quiz"
        className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic transition-all"
      >
        Quiz & Tests
      </Link>
      {user && (
        <Link
          to="/courses"
          className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-babybaby-cosmic/10 hover:text-babybaby-cosmic transition-all flex items-center"
        >
          <BookOpen className="h-4 w-4 mr-1" />
          Cours
        </Link>
      )}
      <ResourcesDropdown isOpen={isResourcesOpen} onToggle={toggleResources} />

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 flex items-center gap-2"
            >
              <User size={16} />
              <span className="max-w-[100px] truncate">
                {user.email?.split('@')[0]}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/parental-dashboard">
                Tableau de bord
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 cursor-pointer"
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};

export default DesktopNav;
