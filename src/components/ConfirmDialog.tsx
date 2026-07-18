import { useEffect } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  tone?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open, title, description, confirmLabel = 'Confirmer', cancelLabel = 'Annuler',
  loading = false, tone = 'danger', onConfirm, onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
      if (e.key === 'Enter' && !loading) onConfirm();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, loading, onCancel, onConfirm]);

  if (!open) return null;

  const btn = tone === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-primary hover:brightness-110 text-white';

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !loading) onCancel(); }}>
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start gap-4 p-6">
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${tone === 'danger' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            {description && <p className="mt-1 text-sm text-ink/60">{description}</p>}
          </div>
          <button onClick={onCancel} disabled={loading}
            className="rounded-lg p-1.5 text-ink/40 hover:bg-black/5 disabled:opacity-40">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-end gap-2 border-t border-black/5 bg-black/[0.02] px-6 py-4">
          <button onClick={onCancel} disabled={loading}
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5 disabled:opacity-60">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} disabled={loading}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm disabled:opacity-60 ${btn}`}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
