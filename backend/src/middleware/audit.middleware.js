import prisma from "../config/prisma.js";

export const auditLog = async ({
  userId,
  action,
  entity,
  entityId,
  oldValues,
  newValues,
  req,
}) => {
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
};
