export function Mesh({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute -left-24 -top-32 h-[40rem] w-[40rem] rounded-full blur-3xl animate-floaty"
        style={{ background: "radial-gradient(circle, rgba(16,185,129,.42) 0%, transparent 60%)" }}
      />
      <div
        className="absolute -right-24 top-10 h-[38rem] w-[38rem] rounded-full blur-3xl animate-floaty"
        style={{ animationDelay: "2s", background: "radial-gradient(circle, rgba(6,182,212,.42) 0%, transparent 60%)" }}
      />
    </div>
  );
}
