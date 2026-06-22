import { PrismaClient } from "@prisma/client";
import { SEED_USERS } from "../src/lib/auth";
import { generateLeads } from "../src/lib/seed-leads";

const prisma = new PrismaClient();

/**
 * Seed de demonstração.
 * Atenção: em produção, troque as senhas em texto puro por hash (bcrypt/argon2).
 */
async function main() {
  for (const u of SEED_USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, name: u.name, role: u.role, password: u.password },
    });
  }

  const leads = generateLeads(60);
  for (const l of leads) {
    const lead = await prisma.lead.create({ data: { name: l.name, phone: l.phone } });
    await prisma.budget.create({
      data: {
        leadId: lead.id,
        journey: { step: l.step },
        completedJourney: l.completed,
        journeyDuration: l.durationSec,
        city: l.city,
        neighborhood: l.neighborhood,
        uf: l.uf,
        leadAge: l.age,
        device: l.device,
        browser: l.browser,
        os: l.os,
        selectedPlan: l.selectedPlan,
        selectedOperator: l.selectedOperator,
        selectedPrice: l.selectedPrice,
        proposalGenerated: l.proposalGenerated,
      },
    });
  }
  console.log(`Seed concluído: ${SEED_USERS.length} usuários, ${leads.length} leads.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
