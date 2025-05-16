
// Re-export from sonner
export { toast } from "sonner";

// Create a custom useToast hook for compatibility
import { toast as sonnerToast } from "sonner";

export const useToast = () => {
  return {
    toast: sonnerToast,
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId);
      } else {
        sonnerToast.dismiss();
      }
    },
    // Add a minimal implementation to be compatible with previous code
    toasts: []
  };
};
