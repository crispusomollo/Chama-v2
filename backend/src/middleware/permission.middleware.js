import prisma from "../config/prisma.js";

export const authorizePermissions = (...requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: {
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      });

      const userPermissions = new Set();

      userRoles.forEach((ur) => {
        ur.role.permissions.forEach((rp) => {
          userPermissions.add(rp.permission.name);
        });
      });

      const hasPermission = requiredPermissions.every((p) =>
        userPermissions.has(p)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};
