
import { Link } from "react-router-dom";
import ResourcesDropdown from "./ResourcesDropdown";

interface DesktopNavProps {
  isResourcesOpen: boolean;
  toggleResources: (e: React.MouseEvent) => void;
}

const DesktopNav = ({ isResourcesOpen, toggleResources }: DesktopNavProps) => {
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
      <ResourcesDropdown isOpen={isResourcesOpen} onToggle={toggleResources} />
    </nav>
  );
};

export default DesktopNav;
