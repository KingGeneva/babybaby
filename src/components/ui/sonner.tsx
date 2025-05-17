
import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const themeContext = useTheme();
  
  // Safely handle theme values with fallbacks
  const resolvedTheme = themeContext?.resolvedTheme || themeContext?.theme || "light";
  const safeTheme = (resolvedTheme === "dark" ? "dark" : "light") as "light" | "dark";

  return (
    <Sonner
      theme={safeTheme}
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
// Export our custom toast function instead of sonner's directly
export { toast, useToast } from "./use-toast";
