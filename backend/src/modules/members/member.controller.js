import { createMember, getMembers, getMemberById, attachUserToMember } from "./member.service.js";

import prisma from "../../config/prisma.js";
import { auditLog } from "../../middleware/audit.middleware.js";

/**
 * Create a new member
 */
export const createMemberController = async (req, res) => {
  try {
    const member = await createMember(req.body);

    return res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create member",
    });
  }
};

/**
 * Get all members
 */
export const getMembersController = async (req, res) => {
  try {
    const members = await getMembers();

    return res.status(200).json({
      success: true,
      data: members,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch members",
    });
  }
};

/**
 * Get single member
 */
export const getMemberController = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await getMemberById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch member",
    });
  }
};


/**
 * Attach user to member

export const attachUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const updated = await attachUserToMember(id, userId);

    return res.status(200).json({
      success: true,
      message: "User attached to member successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to attach user",
    });
  }
};
 */


/* AUDIT ATTACH USER */
export const attachUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const member = await prisma.member.update({
      where: { id },
      data: { userId },
    });

    await auditLog({
      userId: req.user.userId,
      action: "ATTACH_USER",
      entity: "Member",
      entityId: id,
      newValues: { userId },
      req,
    });

    res.json({
      success: true,
      message: "User attached to member successfully",
      data: member,
    });
  } catch (err) {
    next(err);
  }
};


export const approveMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.update({
      where: { id },
      data: { status: "ACTIVE" },
    });

    res.json({
      success: true,
      message: "Member approved",
      data: member,
    });
  } catch (err) {
    next(err);
  }
};


export const suspendMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await prisma.member.update({
      where: { id },
      data: { status: "SUSPENDED" },
    });

    res.json({
      success: true,
      message: "Member suspended",
      data: member,
    });
  } catch (err) {
    next(err);
  }
};