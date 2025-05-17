
import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  // Safe theme handling to avoid context issues with react-helmet-async
  const themeContext = useTheme();
  
  // Set a safe default theme that won't cause errors if context is unavailable
  const safeTheme = (themeContext?.theme === "dark" || themeContext?.resolvedTheme === "dark") 
    ? "dark" 
    : "light";

  return (
    <Sonner
      theme={safeTheme as "light" | "dark"}
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
