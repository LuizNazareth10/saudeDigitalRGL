import { OPERATORS } from "@/lib/data/operators";
import type { OperatorId } from "@/types";

export function OperatorMark({ op, size = 40 }: { op: OperatorId; size?: number }) {
  const o = OPERATORS[op];
  const initials = o.short.split(" ").map((w) => w[0]).join("").slice(0, 2);
  return (
    <div
      className="grid shrink-0 place-items-center rounded-xl font-bold text-white"
      style={{ width: size, height: size, fontSize: size * 0.34, background: `linear-gradient(135deg,${o.from},${o.to})` }}
    >
      {initials}
    </div>
  );
}
