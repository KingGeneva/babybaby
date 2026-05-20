import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Library, MessageCircle, User, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { to: '/', label: 'Accueil', icon: Home, end: true },
  { to: '/articles', label: 'Articles', icon: BookOpen },
  { to: '/ebooks', label: 'E-books', icon: Library },
  { to: '/forum', label: 'Forum', icon: MessageCircle },
  { to: '/parental-dashboard', label: 'Compte', icon: User },
];

/**
 * Fixed bottom navigation visible on mobile only.
 * Boosts multi-page engagement by keeping primary destinations one tap away.
 */
const MobileBottomNav: React.FC = () => {
  return (
    <nav
      aria-label="Navigation principale mobile"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-5 w-5', isActive && 'fill-primary/10')} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
