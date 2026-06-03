import prisma from "../../config/prisma.js";

export const getDashboardKPIsController = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalMembers,
      totalLoans,
      totalContributions,
      totalRepayments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.member.count(),
      prisma.loan.count(),
      prisma.contribution.count(),
      prisma.repayment.count(),
    ]);

    return res.json({
      success: true,
      data: {
        kpis: {
          totalUsers,
          totalMembers,
          totalLoans,
          totalContributions,
          totalRepayments,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};


export const getDashboardActivityController = async (req, res, next) => {
  try {
    const [recentUsers, recentLoans, recentContributions] =
      await Promise.all([
        prisma.user.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
          },
        }),

        prisma.loan.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
        }),

        prisma.contribution.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

    return res.json({
      success: true,
      data: {
        recentUsers,
        recentLoans,
        recentContributions,
      },
    });
  } catch (error) {
    next(error);
  }
};


