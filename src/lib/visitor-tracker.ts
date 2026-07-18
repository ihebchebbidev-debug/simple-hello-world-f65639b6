import { API } from './config';

const SESSION_KEY = 'atlas_visitor_session';

function getOrCreateSessionId(): string {
  let s = sessionStorage.getItem(SESSION_KEY);
  if (!s) {
    s = 'sess_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem(SESSION_KEY, s);
  }
  return s;
}

let tracked = false;
export function trackVisitor() {
  if (tracked) return;
  tracked = true;
  const body = {
    page_url: window.location.href,
    referrer: document.referrer || null,
    language: navigator.language,
    screen_size: `${window.screen.width}x${window.screen.height}`,
    session_id: getOrCreateSessionId(),
  };
  fetch(API.visitorsTrack, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {});
}
