import prisma from "../../config/prisma.js";

export const getUserPermissions = async (userId) => {
  const userRoles =
    await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

  return [
    ...new Set(
      userRoles.flatMap((r) =>
        r.role.permissions.map(
          (p) => p.permission.name
        )
      )
    ),
  ];
};

export const getUserRoles = async (
  userId
) => {
  const roles =
    await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: true,
      },
    });

  return roles.map(
    (r) => r.role.name
  );
};
