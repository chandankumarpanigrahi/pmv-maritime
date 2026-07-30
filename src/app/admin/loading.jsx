export default function AdminLoading() {
  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-slate-900/20 backdrop-blur-xs transition-opacity duration-300 pointer-events-auto">
      <img
        src="/loader.gif"
        alt="Loading..."
        className="w-28 h-28 object-contain bg-white/90 p-2.5 rounded-full shadow-2xl border border-white/60"
      />
    </div>
  );
}
