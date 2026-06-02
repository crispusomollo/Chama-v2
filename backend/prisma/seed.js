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
  "members:create",
  "members:read",
  "members:update",
  "members:delete",
  "member:create",
  "member:read",
  "member:update",
  "member:delete",
  "member:attach_user",
  "users:manage",
  "roles:manage",
  "member:approve",
  "member:suspend",
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
  SECRETARY: ["members:create", "members:read", "members:update", "member:attach_user","member:approve"],
  TREASURER: ["members:read"],
  MEMBER: ["member:read"],
};

for (const roleName of Object.keys(rolePermissions)) {
  const role = await prisma.role.findUnique({ where: { name: roleName } });

  for (const permName of rolePermissions[roleName]) {
    const perm = await prisma.permission.findUnique({
      where: { name: permName },
    });

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