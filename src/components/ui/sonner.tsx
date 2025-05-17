
import * as React from "react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  // Use useState to track when component is mounted
  const [mounted, setMounted] = React.useState(false);
  const { theme, resolvedTheme } = useTheme();
  
  // Only access theme after component is mounted
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null; // Don't render anything until client-side
  }
  
  // Safely handle theme values with fallbacks
  const currentTheme = resolvedTheme || theme || "light";
  const safeTheme = (currentTheme === "dark" ? "dark" : "light") as "light" | "dark";

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
