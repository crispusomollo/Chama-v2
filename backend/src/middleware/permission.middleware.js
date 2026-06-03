import prisma from "../config/prisma.js";

export const authorizePermissions =
  (...permissions) =>
  async (req, res, next) => {
    try {
      const userRoles =
        await prisma.userRole.findMany({
          where: {
            userId: req.user.userId,
          },
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

      const userPermissions =
        userRoles.flatMap((r) =>
          r.role.permissions.map(
            (p) => p.permission.name
          )
        );

      const allowed =
        permissions.every((p) =>
          userPermissions.includes(p)
        );

      if (!allowed) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
