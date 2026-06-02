import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { name: "ADMIN", type: "SYSTEM" },
    { name: "TREASURER", type: "SYSTEM" },
    { name: "SECRETARY", type: "SYSTEM" },
    { name: "AUDITOR", type: "SYSTEM" },

    { name: "MEMBER", type: "BUSINESS" }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {
        type: role.type
      },
      create: {
        name: role.name,
        type: role.type,
        description: `${role.name} role`
      },
    });
  }

  console.log("✅ Roles seeded successfully (SYSTEM + BUSINESS)");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });