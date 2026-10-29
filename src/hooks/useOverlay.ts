import { useEffect, type RefObject } from 'react';

/** Escape-to-close, body scroll lock, and initial focus for dialogs and drawers. */
export function useOverlay(open: boolean, onClose: () => void, focusRef?: RefObject<HTMLElement>) {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => focusRef?.current?.focus(), 30);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, [open, onClose, focusRef]);
}