import { useEffect } from 'react';

// Fires `handler` when Cmd (macOS) or Ctrl (Windows/Linux) is held with `key`.
export function useShortcut(key: string, handler: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isModifierPressed = event.metaKey || event.ctrlKey;
      if (isModifierPressed && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();
        handler();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, handler]);
}
