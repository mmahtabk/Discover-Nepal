export function Loader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-muted">
      <span className="h-10 w-10 animate-spin rounded-full border-2 border-stone-2 border-t-forest" />
      <p className="text-sm">{label}</p>
    </div>
  );
}