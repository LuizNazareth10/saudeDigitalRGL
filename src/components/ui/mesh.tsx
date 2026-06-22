/** Malha de gradiente ambiente — identidade visual RGL Consultoria */
export function Mesh({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* Glow teal-escuro — esquerda */}
      <div
        className="absolute -left-32 -top-40 h-[44rem] w-[44rem] rounded-full blur-3xl animate-floaty"
        style={{ background: "radial-gradient(circle, rgba(10,122,138,.55) 0%, rgba(10,122,138,.10) 45%, transparent 70%)" }}
      />
      {/* Glow ciano brilhante — direita */}
      <div
        className="absolute -right-32 top-0 h-[42rem] w-[42rem] rounded-full blur-3xl animate-floaty"
        style={{ animationDelay: "2.5s", background: "radial-gradient(circle, rgba(20,212,200,.40) 0%, rgba(12,196,190,.08) 50%, transparent 70%)" }}
      />
      {/* Glow fundo — centro-baixo */}
      <div
        className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-[28rem] w-[60rem] rounded-full blur-3xl animate-floaty"
        style={{ animationDelay: "4s", background: "radial-gradient(ellipse, rgba(10,128,144,.30) 0%, transparent 65%)" }}
      />
    </div>
  );
}
