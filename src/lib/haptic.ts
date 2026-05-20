/**
 * Subtle haptic feedback for tap confirmations.
 * Gracefully no-ops on devices without Vibration API.
 */
export const haptic = {
  tap: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(8);
    }
  },
  success: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([12, 40, 12]);
    }
  },
  warn: () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([20, 60, 20]);
    }
  },
};
