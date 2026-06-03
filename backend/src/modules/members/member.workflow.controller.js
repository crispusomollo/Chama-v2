import prisma from "../../config/prisma.js";
import { logAudit } from "../../utils/audit.js";

export const createMemberController = async (req, res, next) => {
  try {
    const { userId, fullName, phone } = req.body;

    const member = await prisma.member.create({
      data: {
        userId,
        fullName,
        phone,
        status: "PENDING",
      },
    });

    await logAudit({
      userId: req.user.userId,
      action: "MEMBER_CREATED",
      entity: "MEMBER",
      entityId: member.id,
      req,
    });

    return res.json({
      success: true,
      data: member,
    });
  } catch (error) {
    next(error);
  }
};


export const approveMemberController = async (req, res, next) => {
  try {
    const { memberId } = req.params;

    const member = await prisma.member.update({
      where: { id: memberId },
      data: {
        status: "APPROVED",
      },
    });

    await logAudit({
      userId: req.user.userId,
      action: "MEMBER_APPROVED",
      entity: "MEMBER",
      entityId: memberId,
      req,
    });

    return res.json({
      success: true,
      message: "Member approved",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};


export const activateMemberController = async (req, res, next) => {
  try {
    const { memberId } = req.params;

    const member = await prisma.member.update({
      where: { id: memberId },
      data: {
        status: "ACTIVE",
      },
    });

    await logAudit({
      userId: req.user.userId,
      action: "MEMBER_ACTIVATED",
      entity: "MEMBER",
      entityId: memberId,
      req,
    });

    return res.json({
      success: true,
      message: "Member activated",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};


export const rejectMemberController = async (req, res, next) => {
  try {
    const { memberId } = req.params;

    const member = await prisma.member.update({
      where: { id: memberId },
      data: {
        status: "REJECTED",
      },
    });

    await logAudit({
      userId: req.user.userId,
      action: "MEMBER_REJECTED",
      entity: "MEMBER",
      entityId: memberId,
      req,
    });

    return res.json({
      success: true,
      message: "Member rejected",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};



