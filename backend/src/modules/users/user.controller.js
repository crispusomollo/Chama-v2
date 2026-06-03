import prisma from "../../config/prisma.js";
import { logAudit } from "../../utils/audit.js";

export const getUsersController =
  async (req, res, next) => {
    try {
      const users =
        await prisma.user.findMany({
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

      return res.json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

export const assignRoleController =
  async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { roleId } = req.body;

      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
        update: {},
        create: {
          userId,
          roleId,
        },
      });

      await logAudit({
        userId: req.user.userId,
        action: "ASSIGN_ROLE",
        entity: "USER",
        entityId: userId,
        req,
      });

      return res.json({
        success: true,
        message: "Role assigned",
      });
    } catch (error) {
      next(error);
    }
  };

export const removeRoleController =
  async (req, res, next) => {
    try {
      const { userId, roleId } =
        req.params;

      await prisma.userRole.deleteMany({
        where: {
          userId,
          roleId,
        },
      });

      await logAudit({
        userId: req.user.userId,
        action: "REMOVE_ROLE",
        entity: "USER",
        entityId: userId,
        req,
      });

      return res.json({
        success: true,
        message: "Role removed",
      });
    } catch (error) {
      next(error);
    }
  };
