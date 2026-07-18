const KEY = 'atlas_cookie_consent'; // 'accepted' | 'declined'
type Consent = 'accepted' | 'declined' | null;

const listeners = new Set<(c: Consent) => void>();

export function getConsent(): Consent {
  try { return (localStorage.getItem(KEY) as Consent) || null; } catch { return null; }
}
export function setConsent(v: 'accepted' | 'declined') {
  try { localStorage.setItem(KEY, v); } catch {}
  listeners.forEach((cb) => cb(v));
}
export function onConsentChange(cb: (c: Consent) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
