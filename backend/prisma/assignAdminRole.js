import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userEmail = "admin@test.com";

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  const adminRole = await prisma.role.findUnique({
    where: { name: "ADMIN" },
  });

  if (!user || !adminRole) {
    console.log("User or role not found");
    return;
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: adminRole.id,
    },
  });

  console.log("ADMIN role assigned to user");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
