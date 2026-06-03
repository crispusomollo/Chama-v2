import prisma from "../config/prisma.js";

async function main() {

  const adminRole =
    await prisma.role.findUnique({
      where: {
        name: "ADMIN",
      },
    });

  const permissions =
    await prisma.permission.findMany();

  for (const permission of permissions) {

    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log(
    "Admin permissions assigned"
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
