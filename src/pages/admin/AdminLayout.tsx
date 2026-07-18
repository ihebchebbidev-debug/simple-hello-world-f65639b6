import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, LogOut, Sprout, Tag } from 'lucide-react';
import { adminLogout, isAdminAuthed } from '@/lib/admin-auth';

export default function AdminLayout() {
  const navigate = useNavigate();
  if (!isAdminAuthed()) return <Navigate to="/admin/login" replace />;

  const items = [
    { to: '/admin', label: 'Tableau de bord', Icon: LayoutDashboard, end: true },
    { to: '/admin/produits', label: 'Produits', Icon: Package },
    { to: '/admin/categories', label: 'Catégories', Icon: Tag },
    { to: '/admin/visiteurs', label: 'Visiteurs', Icon: Users },
  ];

  return (
    <div className="min-h-dvh bg-[#F6F7F4] pt-24 md:pt-28">
      <div className="container-x grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="h-fit rounded-2xl border border-black/5 bg-white p-4 shadow-sm lg:sticky lg:top-28">
          <Link to="/" className="mb-4 flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-ink/70 hover:bg-black/5">
            <Sprout className="h-4 w-4 text-primary" />
            <span className="font-semibold">Atlas Agricole</span>
          </Link>
          <nav className="grid gap-1">
            {items.map(({ to, label, Icon, end }) => (
              <NavLink
                key={to} to={to} end={end as any}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                    isActive ? 'bg-primary text-white shadow-sm' : 'text-ink/70 hover:bg-black/5'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={() => { adminLogout(); navigate('/admin/login'); }}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
        </aside>
        <main className="pb-16"><Outlet /></main>
      </div>
    </div>
  );
}
