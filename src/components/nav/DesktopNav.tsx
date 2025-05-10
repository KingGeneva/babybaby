
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DesktopNavProps {
  isResourcesOpen: boolean;
  toggleResources: (e: React.MouseEvent) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
  isResourcesOpen,
  toggleResources,
}) => {
  const { user, signOut } = useAuth();

  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.substring(0, 1).toUpperCase();
  };

  return (
    <div className="hidden md:flex items-center space-x-4">
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <Link to="/tools">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Outils
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/articles">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Articles
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/quiz">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Quiz
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/contests">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Concours
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          {user && (
            <>
              <NavigationMenuItem>
                <Link to="/courses">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Cours
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/parental-dashboard">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Tableau de bord
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
          )}
          <NavigationMenuItem>
            <a
              href="#"
              onClick={toggleResources}
              className={`${navigationMenuTriggerStyle()} ${
                isResourcesOpen ? "bg-accent text-accent-foreground" : ""
              }`}
            >
              Ressources
            </a>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-babybaby-cosmic text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm font-medium">
              {user.email}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/parental-dashboard" className="flex items-center cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Tableau de bord</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={signOut}
              className="text-red-500 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Se déconnecter</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default DesktopNav;
