
import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  // Gérer le thème avec une approche plus sécurisée
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const themeContext = useTheme();
  
  React.useEffect(() => {
    // Mettre à jour le thème selon le contexte lorsqu'il est disponible
    if (themeContext?.theme === "dark" || themeContext?.resolvedTheme === "dark") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, [themeContext?.theme, themeContext?.resolvedTheme]);

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
// Exporter notre fonction toast personnalisée au lieu de celle de sonner directement
export { toast, useToast } from "@/components/ui/use-toast";
