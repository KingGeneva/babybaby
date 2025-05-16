
// Adapt Sonner toast to be compatible with shadcn/ui toast API
import { toast as sonnerToast } from "sonner";
import { ReactNode } from "react";

// Define types that match the expected API across the codebase
export interface ToastProps {
  title?: string;
  description?: string;
  action?: {
    children: ReactNode;
    onClick: () => void;
  };
  variant?: "default" | "destructive";
  duration?: number;
}

// Helper function to safely convert React nodes to string
function reactNodeToString(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return node.toString();
  if (node === null || node === undefined) return 'Action';
  if (Array.isArray(node)) return node.map(reactNodeToString).join('');
  if (typeof node === 'object') return 'Action';
  return String(node);
}

// Custom toast function that maps the shadcn/ui style API to sonner
export function toast(props: ToastProps | string) {
  if (typeof props === 'string') {
    return sonnerToast(props);
  }
  
  const { title, description, variant, duration, action } = props;
  
  return sonnerToast(title || "", {
    description,
    duration,
    // Map variant to Sonner's style
    className: variant === "destructive" ? "destructive" : undefined,
    action: action ? {
      label: reactNodeToString(action.children),
      onClick: action.onClick
    } : undefined
  });
}

// Additional utility methods to match sonner's API
toast.error = (message: string, options?: any) => sonnerToast.error(message, options);
toast.success = (message: string, options?: any) => sonnerToast.success(message, options);
toast.info = (message: string, options?: any) => sonnerToast.info(message, options);
toast.warning = (message: string, options?: any) => sonnerToast.warning(message, options);
toast.dismiss = (toastId?: string) => sonnerToast.dismiss(toastId);

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
