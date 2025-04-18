
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export const AuthButtons = () => {
  const { user } = useAuth();

  return (
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
    </div>
  );
};
