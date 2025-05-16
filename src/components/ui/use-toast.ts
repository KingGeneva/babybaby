
// Export toast from sonner
import { toast as sonnerToast, type ToastT } from "sonner";

// Create a custom useToast hook that is compatible with other code that might expect it
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
    toasts: [] as any[]
  };
};

// Re-export toast from sonner for direct imports
export const toast = sonnerToast;
