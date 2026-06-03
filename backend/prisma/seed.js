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

  const permissions = [
    // Members
    "member.create",
    "member.view",
    "member.update",
    "member.delete",
    "member.attach_user",
    "member.approve",
    "member.suspend",

    // Contributions
    "contribution.create",
    "contribution.view",
    "contribution.update",
    "contribution.delete",
    "contribution.approve",

    // Loans
    "loan.create",
    "loan.view",
    "loan.approve",
    "loan.disburse",

    // Repayments
    "repayment.create",
    "repayment.view",
    "repayment.reverse",

    // Users
    "user.create",
    "user.view",
    "user.unlock",
    "user.assign_role",
    "user.remove_role",
    "user.unlock",

    // Audits
    "audit.view",

  ];

for (const name of permissions) {
  await prisma.permission.upsert({
    where: { name },
    update: {},
    create: {
      name,
      description: `${name} permission`,
    },
  });
}

const rolePermissions = {

  ADMIN: permissions,

  SECRETARY: [
    "member.create",
    "member.view",
    "member.update",
    "member.attach_user",
    "member.approve",
  ],

  TREASURER: [
    "member.view",

    "contribution.create",
    "contribution.view",
    "contribution.approve",

    "loan.view",
  ],

  AUDITOR: [
    "member.view",
    "contribution.view",
    "loan.view",
    "repayment.view",
    "audit.view",
  ],

  MEMBER: [
    "member.view",
  ],
};

for (const roleName of Object.keys(rolePermissions)) {
  const role = await prisma.role.findUnique({ where: { name: roleName } });

  for (const permName of rolePermissions[roleName]) {
    const perm = await prisma.permission.findUnique({
      where: { name: permName },
    });

    if (!perm) {
      console.log(
        `Permission not found: ${permName}`
      );
        continue;
    }

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: role.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: role.id,
        permissionId: perm.id,
      },
    });
  }
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