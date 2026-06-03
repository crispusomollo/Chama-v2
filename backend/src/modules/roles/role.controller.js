import prisma from "../../config/prisma.js";

export const getRolesController =
  async (req, res, next) => {
    try {
      const roles =
        await prisma.role.findMany({
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        });

      return res.json({
        success: true,
        data: roles,
      });
    } catch (error) {
      next(error);
    }
  };
