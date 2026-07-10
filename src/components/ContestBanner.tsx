import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, X } from 'lucide-react';

const STORAGE_KEY = 'bb_contest_banner_dismissed_v1';

const ContestBanner: React.FC = () => {
  const [dismissed, setDismissed] = React.useState(true);

  React.useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === '1');
    } catch {
      setDismissed(false);
    }
  }, []);

  const close = () => {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="relative z-40 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-2 pr-10">
        <Gift className="h-4 w-4 shrink-0" />
        <span className="text-center">
          <strong>Concours en cours&nbsp;:</strong> gagne un panier de naissance québécois (valeur 250&nbsp;$).{' '}
          <Link to="/contests" className="underline underline-offset-2 font-medium hover:opacity-90">
            Je participe
          </Link>
        </span>
        <button
          onClick={close}
          aria-label="Fermer la bannière"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ContestBanner;
