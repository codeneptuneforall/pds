import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
  typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useIsCompact() {
  return useMediaQuery('(max-width: 1023px)');
}

export function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      const attrs = { antialias: false, alpha: false, depth: true, stencil: false, failIfMajorPerformanceCaveat: false };
      const gl =
        canvas.getContext('webgl2', attrs) ||
        canvas.getContext('webgl', attrs) ||
        (canvas.getContext as any)('experimental-webgl', attrs);
      if (!gl) return false;
      // Test basic capability
      const debugInfo = (gl as any).getExtension?.('WEBGL_debug_renderer_info');
      if (debugInfo) {
        try {
          (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        } catch {}
      }
      return true;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Recheck in case detection failed due to timing
    if (supported) return;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (gl) setSupported(true);
    } catch {}
  }, [supported]);

  return supported;
}