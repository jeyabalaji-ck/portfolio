import { useCallback, useEffect, useState } from 'react';

export type CopyStatus = 'idle' | 'copied' | 'error';

/** Copies text to the clipboard and exposes a status that resets after `resetMs`. */
export function useCopyToClipboard(resetMs = 2000) {
  const [status, setStatus] = useState<CopyStatus>('idle');

  useEffect(() => {
    if (status === 'idle') return;
    const timer = window.setTimeout(() => setStatus('idle'), resetMs);
    return () => window.clearTimeout(timer);
  }, [status, resetMs]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
  }, []);

  return { status, copy };
}
