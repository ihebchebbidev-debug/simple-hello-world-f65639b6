const KEY = 'atlas_admin_auth';
const USERNAME = 'atlasagricole';
const PASSWORD = 'atlasagricole';

export function adminLogin(u: string, p: string): boolean {
  if (u === USERNAME && p === PASSWORD) {
    sessionStorage.setItem(KEY, '1');
    return true;
  }
  return false;
}
export function adminLogout() { sessionStorage.removeItem(KEY); }
export function isAdminAuthed(): boolean { return sessionStorage.getItem(KEY) === '1'; }
