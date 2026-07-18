import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary-700">404</p>
      <h1 className="mt-3 text-5xl font-extrabold text-ink">Page introuvable</h1>
      <p className="mt-3 max-w-md text-ink/60">La page que vous recherchez n'existe pas ou a été déplacée.</p>
      <Link to="/" className="btn-primary mt-8">Retour à l'accueil</Link>
    </div>
  );
}
