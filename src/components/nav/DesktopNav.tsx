
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, Store } from "lucide-react";
import ResourcesDropdown from "./ResourcesDropdown";
import { motion } from "framer-motion";
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
import { cn } from "@/lib/utils";

interface DesktopNavProps {
  isResourcesOpen: boolean;
  toggleResources: (e: React.MouseEvent) => void;
}

const DesktopNav: React.FC<DesktopNavProps> = ({
  isResourcesOpen,
  toggleResources,
}) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.substring(0, 1).toUpperCase();
  };
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="hidden md:flex items-center space-x-4">
      <NavigationMenu>
        <NavigationMenuList className="gap-1">
          <NavigationMenuItem>
            <Link to="/tools">
              <NavigationMenuLink className={cn(
                navigationMenuTriggerStyle(),
                isActive("/tools") && "bg-babybaby-cosmic/10 text-babybaby-cosmic font-medium"
              )}>
                Outils
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/articles">
              <NavigationMenuLink className={cn(
                navigationMenuTriggerStyle(),
                isActive("/articles") && "bg-babybaby-cosmic/10 text-babybaby-cosmic font-medium"
              )}>
                Articles
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/articles/meilleures-poussettes-2025">
              <NavigationMenuLink className={cn(
                navigationMenuTriggerStyle(),
                isActive("/articles/meilleures-poussettes-2025") && "bg-babybaby-cosmic/10 text-babybaby-cosmic font-medium"
              )}>
                Meilleures Poussettes
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/quiz">
              <NavigationMenuLink className={cn(
                navigationMenuTriggerStyle(),
                isActive("/quiz") && "bg-babybaby-cosmic/10 text-babybaby-cosmic font-medium"
              )}>
                Quiz
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/contests">
              <NavigationMenuLink className={cn(
                navigationMenuTriggerStyle(),
                isActive("/contests") && "bg-babybaby-cosmic/10 text-babybaby-cosmic font-medium"
              )}>
                Concours
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <a 
              href="https://babybaby.boutique" 
              target="_blank" 
              rel="noopener noreferrer" 
              className={navigationMenuTriggerStyle()}
            >
              <span className="flex items-center">
                <Store className="mr-1 h-4 w-4" />
                Boutique
              </span>
            </a>
          </NavigationMenuItem>
          {user && (
            <>
              <NavigationMenuItem>
                <Link to="/courses">
                  <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/courses") && "bg-babybaby-cosmic/10 text-babybaby-cosmic font-medium"
                  )}>
                    Cours
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/parental-dashboard">
                  <NavigationMenuLink className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/parental-dashboard") && "bg-babybaby-cosmic/10 text-babybaby-cosmic font-medium"
                  )}>
                    Tableau de bord
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
          )}
          <ResourcesDropdown 
            isOpen={isResourcesOpen}
            onToggle={toggleResources}
          />
        </NavigationMenuList>
      </NavigationMenu>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover-lift">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-babybaby-cosmic to-blue-400 text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-card">
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
