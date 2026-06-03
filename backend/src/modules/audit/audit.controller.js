import prisma from "../../config/prisma.js";

export const getAuditLogsController = async (req, res, next) => {
  try {
    const {
      userId,
      action,
      entity,
      dateFrom,
      dateTo,
      page = 1,
      limit = 50,
    } = req.query;

    const where = {};

    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entity) where.entity = entity;

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: Number(limit),
    });

    const total = await prisma.auditLog.count({ where });

    return res.json({
      success: true,
      data: logs,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};