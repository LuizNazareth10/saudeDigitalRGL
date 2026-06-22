"use client";
import * as React from "react";
import {
  Shield, Plus, MapPin, Layers, SlidersHorizontal, History,
  Pencil, Trash2, UserPlus, AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { OperatorMark } from "@/components/brand/OperatorMark";
import { OPERATOR_LIST } from "@/lib/data/operators";
import { PLANS } from "@/lib/data/plans";
import { AGE_BANDS, MODIFIERS } from "@/lib/pricing";
import { WEIGHTS } from "@/lib/recommendation";
import { BRL, pct } from "@/lib/format";
import type { OperatorId, PlanTier } from "@/types";

// ─── types ────────────────────────────────────────────────────────────────────
type Role = "operador" | "gestor" | "admin";
interface AdminUser {
  id: string; email: string; name: string; role: Role; active: boolean; createdAt: string;
}

// ─── helpers ──────────────────────────────────────────────────────────────────
function Header({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between">
      <div><h2 className="text-lg font-semibold">{title}</h2><p className="text-sm text-muted">{desc}</p></div>
      {action}
    </div>
  );
}

const roleBadge: Record<Role, string> = {
  admin: "border-rose-500/30 bg-rose-500/10 text-rose-500",
  gestor: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  operador: "border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}

// ─── UserForm modal ────────────────────────────────────────────────────────────
function UserForm({
  initial,
  onSave,
  onClose,
  loading,
  error,
}: {
  initial?: Partial<AdminUser>;
  onSave: (data: { name: string; email: string; password: string; role: Role }) => void;
  onClose: () => void;
  loading: boolean;
  error: string;
}) {
  const [name, setName] = React.useState(initial?.name ?? "");
  const [email, setEmail] = React.useState(initial?.email ?? "");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<Role>(initial?.role ?? "operador");

  const isEdit = !!initial?.id;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, email, password, role });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Nome completo">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="João Silva" required />
      </Field>
      <Field label="E-mail">
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@empresa.com" required disabled={isEdit} />
      </Field>
      <Field label={isEdit ? "Nova senha (deixe em branco para manter)" : "Senha"}>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required={!isEdit} />
      </Field>
      <Field label="Perfil">
        <div className="flex gap-2">
          {(["operador", "gestor", "admin"] as Role[]).map((r) => (
            <button
              key={r} type="button"
              onClick={() => setRole(r)}
              className={`flex-1 rounded-xl border py-2 text-sm font-medium capitalize transition ${role === r ? "brand-gradient border-transparent text-white" : "surface text-muted hover:text-white"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </Field>
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-500">
          <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      <div className="flex gap-2 pt-1">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? "Salvando…" : isEdit ? "Salvar alterações" : "Criar usuário"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
      </div>
    </form>
  );
}

// ─── AdminUsers ────────────────────────────────────────────────────────────────
export function AdminUsers() {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalMode, setModalMode] = React.useState<"create" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = React.useState<AdminUser | null>(null);
  const [formError, setFormError] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const fetchUsers = React.useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data.users ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openCreate = () => { setSelected(null); setFormError(""); setModalMode("create"); };
  const openEdit = (u: AdminUser) => { setSelected(u); setFormError(""); setModalMode("edit"); };
  const openDelete = (u: AdminUser) => { setSelected(u); setModalMode("delete"); };
  const closeModal = () => { setModalMode(null); setSelected(null); setFormError(""); };

  const handleSave = async (data: { name: string; email: string; password: string; role: Role }) => {
    setSaving(true);
    setFormError("");
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) { setFormError(json.error ?? "Erro ao criar"); return; }
        setUsers((prev) => [...prev, json.user]);
      } else if (modalMode === "edit" && selected) {
        const body: Record<string, string> = { name: data.name, role: data.role };
        if (data.password) body.password = data.password;
        const res = await fetch(`/api/users/${selected.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) { setFormError(json.error ?? "Erro ao atualizar"); return; }
        setUsers((prev) => prev.map((u) => (u.id === json.user.id ? json.user : u)));
      }
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch(`/api/users/${selected.id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.id !== selected.id));
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header
        title="Usuários e permissões"
        desc="Controle de acesso por perfil."
        action={
          <Button size="sm" onClick={openCreate}>
            <UserPlus className="h-3.5 w-3.5" /> Novo usuário
          </Button>
        }
      />

      {/* Create / Edit modal */}
      {(modalMode === "create" || modalMode === "edit") && (
        <Modal
          open
          onClose={closeModal}
          title={modalMode === "create" ? "Novo usuário" : "Editar usuário"}
        >
          <UserForm
            initial={selected ?? undefined}
            onSave={handleSave}
            onClose={closeModal}
            loading={saving}
            error={formError}
          />
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {modalMode === "delete" && selected && (
        <Modal open onClose={closeModal} title="Remover usuário">
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
              <div>
                <div className="font-medium text-rose-400">Confirmar remoção</div>
                <div className="mt-1 text-sm text-muted">
                  O usuário <strong>{selected.name}</strong> ({selected.email}) será removido permanentemente.
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDelete}
                disabled={saving}
                className="flex-1 bg-rose-600 hover:opacity-90"
              >
                {saving ? "Removendo…" : "Sim, remover"}
              </Button>
              <Button variant="outline" onClick={closeModal}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-sm text-faint">Carregando…</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left font-mono text-[11px] uppercase tracking-wider text-faint">
                <th className="px-4 py-3 font-medium">Usuário</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Perfil</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge className={roleBadge[u.role]}>
                      <Shield className="h-3 w-3" /> {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={u.active ? "border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400" : "surface text-faint"}>
                      {u.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(u)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-faint transition hover:bg-white/10 hover:text-white"
                        title="Editar"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => openDelete(u)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-faint transition hover:bg-rose-500/20 hover:text-rose-400"
                        title="Remover"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

// ─── AdminOperators ────────────────────────────────────────────────────────────
export function AdminOperators() {
  return (
    <div>
      <Header title="Operadoras" desc="Cobertura por localidade. As regionais são limitadas por cidade; Sul América é nacional." />
      <div className="grid gap-4 sm:grid-cols-2">
        {OPERATOR_LIST.map((o) => (
          <Card key={o.id} className="p-5">
            <div className="flex items-center gap-3">
              <OperatorMark op={o.id} size={44} />
              <div><div className="font-semibold">{o.name}</div><div className="text-xs text-muted">{o.note}</div></div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-faint"><MapPin className="h-3.5 w-3.5" /> Cidades atendidas</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {o.regions.includes("*")
                ? <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-500">Cobertura nacional</Badge>
                : o.regions.map((c) => <Badge key={c} className="surface">{c}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── PlanForm modal ────────────────────────────────────────────────────────────
interface CustomPlan {
  id: string; operator: OperatorId; name: string;
  tier: PlanTier; basePrice: number; margin: number;
  network: string[]; coverage: string; benefits: string[];
}

function PlanForm({
  onSave,
  onClose,
}: {
  onSave: (plan: CustomPlan) => void;
  onClose: () => void;
}) {
  const [name, setName] = React.useState("");
  const [operator, setOperator] = React.useState<OperatorId>("cedplan");
  const [tier, setTier] = React.useState<PlanTier>("Essencial");
  const [basePrice, setBasePrice] = React.useState("");
  const [margin, setMargin] = React.useState("");
  const [coverage, setCoverage] = React.useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `custom-${Date.now()}`,
      operator,
      name: name.trim(),
      tier,
      basePrice: Number(basePrice),
      margin: Number(margin) / 100,
      network: [],
      coverage: coverage.trim() || "Regional",
      benefits: [],
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Nome do plano">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Cedplan Master" required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Operadora">
          <select
            value={operator}
            onChange={(e) => setOperator(e.target.value as OperatorId)}
            className="h-11 w-full rounded-xl border surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/60"
          >
            {OPERATOR_LIST.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </Field>
        <Field label="Tier">
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as PlanTier)}
            className="h-11 w-full rounded-xl border surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/60"
          >
            {(["Essencial", "Plus", "Premium"] as PlanTier[]).map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Mensalidade base (R$)">
          <Input type="number" min="0" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} placeholder="250.00" required />
        </Field>
        <Field label="Margem (%)">
          <Input type="number" min="0" max="100" step="0.1" value={margin} onChange={(e) => setMargin(e.target.value)} placeholder="25" required />
        </Field>
      </div>
      <Field label="Cobertura geográfica">
        <Input value={coverage} onChange={(e) => setCoverage(e.target.value)} placeholder="Ex: Juiz de Fora / MG" />
      </Field>
      <p className="text-xs text-faint">
        Plano adicionado ao catálogo desta sessão. Rede hospitalar e benefícios podem ser configurados via código.
      </p>
      <div className="flex gap-2 pt-1">
        <Button type="submit" className="flex-1">Adicionar plano</Button>
        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
      </div>
    </form>
  );
}

// ─── AdminPlans ────────────────────────────────────────────────────────────────
export function AdminPlans() {
  const [customPlans, setCustomPlans] = React.useState<CustomPlan[]>([]);
  const [showPlanModal, setShowPlanModal] = React.useState(false);

  const allPlans = [...PLANS, ...customPlans];

  const handleAddPlan = (plan: CustomPlan) => {
    setCustomPlans((prev) => [...prev, plan]);
    setShowPlanModal(false);
  };

  return (
    <div>
      {showPlanModal && (
        <Modal open onClose={() => setShowPlanModal(false)} title="Novo plano">
          <PlanForm onSave={handleAddPlan} onClose={() => setShowPlanModal(false)} />
        </Modal>
      )}

      <Header
        title="Planos"
        desc="Catálogo com mensalidade-base de mercado, rede e margem."
        action={<Button size="sm" onClick={() => setShowPlanModal(true)}><Plus className="h-3.5 w-3.5" /> Novo plano</Button>}
      />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left font-mono text-[11px] uppercase tracking-wider text-faint">
                <th className="px-4 py-3 font-medium">Plano</th>
                <th className="px-4 py-3 font-medium">Tier</th>
                <th className="px-4 py-3 font-medium">Rede</th>
                <th className="px-4 py-3 text-right font-medium">Margem</th>
                <th className="px-4 py-3 text-right font-medium">Base</th>
              </tr>
            </thead>
            <tbody>
              {allPlans.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <OperatorMark op={p.operator} size={28} />
                      <span className="font-medium">{p.name}</span>
                      {customPlans.some((c) => c.id === p.id) && (
                        <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-500 text-[10px]">novo</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge className="surface">{p.tier}</Badge></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{p.network.length} hospitais</td>
                  <td className="px-4 py-3 text-right font-mono">{pct(p.margin * 100)}</td>
                  <td className="px-4 py-3 text-right font-mono">{BRL(p.basePrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── AdminPrices ────────────────────────────────────────────────────────────────
export function AdminPrices() {
  return (
    <div className="space-y-6">
      <Header title="Regras de precificação" desc="Faixas etárias ANS, modificadores e pesos do score — toda a lógica de negócio centralizada." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><SlidersHorizontal className="h-4 w-4 text-brand-500" /> Faixas etárias (ANS)</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AGE_BANDS.map((b) => (
              <div key={b.label} className="rounded-lg border surface p-2.5 text-center">
                <div className="font-mono text-xs text-faint">{b.label}</div>
                <div className="font-mono text-sm font-semibold">×{b.mult}</div>
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-3 text-sm font-semibold">Modificadores</div>
            <Mod label="Apartamento (vs enfermaria)" v={`×${MODIFIERS.apartamento}`} />
            <Mod label="Sem coparticipação (vs com)" v={`×${MODIFIERS.semCoparticipacao}`} />
            <Mod label="Dependente (titular = ×1.0)" v={`×${MODIFIERS.dependente}`} />
          </Card>
          <Card className="p-5">
            <div className="mb-3 text-sm font-semibold">Pesos do score</div>
            <Mod label="Cobertura de hospitais" v={pct(WEIGHTS.hospital * 100)} />
            <Mod label="Menor preço" v={pct(WEIGHTS.price * 100)} />
            <Mod label="Maior margem" v={pct(WEIGHTS.margin * 100)} />
          </Card>
        </div>
      </div>
    </div>
  );
}

function Mod({ label, v }: { label: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b py-2 text-sm last:border-0">
      <span className="text-muted">{label}</span><span className="font-mono font-semibold text-brand-500">{v}</span>
    </div>
  );
}

// ─── AdminAudit ────────────────────────────────────────────────────────────────
const AUDIT = [
  { who: "admin@segurosdigital.com.br", what: "Atualizou margem do plano Unimed Premium", when: "Há 2 horas" },
  { who: "gestor@segurosdigital.com.br", what: "Exportou relatório de leads (CSV)", when: "Há 5 horas" },
  { who: "admin@segurosdigital.com.br", what: "Criou usuário operador", when: "Ontem" },
  { who: "operador@segurosdigital.com.br", what: "Visualizou proposta #L1043", when: "Ontem" },
  { who: "admin@segurosdigital.com.br", what: "Alterou peso do score (hospital 0.5)", when: "Há 2 dias" },
];

export function AdminAudit() {
  return (
    <div>
      <Header title="Auditoria" desc="Trilha de ações no sistema." />
      <Card className="p-2">
        {AUDIT.map((a, i) => (
          <div key={i} className="flex items-start gap-3 border-b p-3 last:border-0">
            <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-500/10">
              <History className="h-4 w-4 text-brand-500" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm">{a.what}</div>
              <div className="font-mono text-xs text-faint">{a.who}</div>
            </div>
            <span className="shrink-0 text-xs text-faint">{a.when}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}
