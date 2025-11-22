import { createContext, useContext, ReactNode } from "react";

// Simple theme types – we keep the API but avoid any hook logic
// to prevent runtime issues while still allowing future extension.
type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme; // kept for compatibility, currently unused
  storageKey?: string;  // kept for compatibility, currently unused
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Static default implementation – always "light" theme for now.
const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "light",
  // No-op setter to keep API compatible; can be wired later if needed
  setTheme: () => {},
});

export function ThemeProvider({ children }: ThemeProviderProps) {
  // We intentionally avoid useState/useEffect here to sidestep
  // hook/React dispatcher issues causing the runtime error.
  const value: ThemeProviderState = {
    theme: "light",
    setTheme: () => {},
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
