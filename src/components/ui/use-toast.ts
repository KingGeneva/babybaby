
// Adapt Sonner toast to be compatible with shadcn/ui toast API
import { toast as sonnerToast, type Toast as SonnerToast } from "sonner";

// Define types that match the expected API across the codebase
export interface ToastProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
}

// Custom toast function that maps the shadcn/ui style API to sonner
export function toast(props: ToastProps) {
  if (typeof props === 'string') {
    return sonnerToast(props);
  }
  
  const { title, description, variant, duration, action } = props;
  
  return sonnerToast(title || "", {
    description,
    duration,
    // Map variant to Sonner's style
    className: variant === "destructive" ? "destructive" : undefined,
    action
  });
}

// Create a custom useToast hook that is compatible with other code that might expect it
export const useToast = () => {
  return {
    toast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    },
    // Add a minimal implementation to be compatible with previous code
    toasts: [] as any[]
  };
};

// Re-export the original sonner toast for direct imports if needed
export { sonnerToast };
