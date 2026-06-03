import prisma from "../config/prisma.js";

export const logAudit = async ({
  userId = null,
  action,
  entity,
  entityId = null,
  req,
  oldValues = null,
  newValues = null,
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        oldValues,
        newValues,
        ipAddress: req?.ip,
        userAgent: req?.headers["user-agent"],
      },
    });
  } catch (error) {
    console.error(
      "Audit logging failed:",
      error.message
    );
  }
};
