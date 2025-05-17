
import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  // Get the theme context safely with a default value
  const themeContext = useTheme();
  
  // Set a safe default theme - use system theme if context is not available
  const theme = themeContext?.theme || themeContext?.resolvedTheme || "system";
  const safeTheme = (theme === "dark" ? "dark" : "light") as "light" | "dark";

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
