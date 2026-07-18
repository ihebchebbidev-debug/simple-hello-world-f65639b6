import { useState, FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Sprout, Lock, User, AlertCircle } from 'lucide-react';
import { adminLogin, isAdminAuthed } from '@/lib/admin-auth';

export default function AdminLogin() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  if (isAdminAuthed()) return <Navigate to="/admin" replace />;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (adminLogin(u.trim(), p)) nav('/admin');
    else setErr('Identifiants invalides');
  };

  return (
    <div className="min-h-dvh grid place-items-center bg-gradient-to-br from-[#EAF1E6] via-[#F6F7F4] to-[#F1E6DE] px-4 pt-24">
      <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white shadow-lg">
            <Sprout className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold text-ink">Espace Administrateur</h1>
          <p className="text-sm text-ink/60">Atlas Agricole — Panneau de gestion</p>
        </div>
        <form onSubmit={submit} className="grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-ink/70">Nom d'utilisateur</span>
            <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 focus-within:border-primary">
              <User className="h-4 w-4 text-ink/40" />
              <input value={u} onChange={(e) => setU(e.target.value)} required
                className="w-full bg-transparent py-3 text-sm outline-none" placeholder="atlasagricole" />
            </div>
          </label>
          <label className="grid gap-1.5">
            <span className="text-xs font-medium text-ink/70">Mot de passe</span>
            <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 focus-within:border-primary">
              <Lock className="h-4 w-4 text-ink/40" />
              <input type="password" value={p} onChange={(e) => setP(e.target.value)} required
                className="w-full bg-transparent py-3 text-sm outline-none" placeholder="••••••••" />
            </div>
          </label>
          {err && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" /> {err}
            </div>
          )}
          <button className="mt-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
