import { createMemberSchema } from "./member.validator.js";
import {
  createMember,
  getAllMembers,
  getMemberById,
} from "./member.service.js";

export const createMemberController = async (req, res) => {
  try {
    const parsed = createMemberSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors,
      });
    }

    const member = await createMember(parsed.data);

    return res.status(201).json({
      success: true,
      message: "Member created successfully",
      data: member,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMembersController = async (req, res) => {
  const members = await getAllMembers();

  res.json({
    success: true,
    data: members,
  });
};

export const getMemberController = async (req, res) => {
  const member = await getMemberById(req.params.id);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: "Member not found",
    });
  }

  res.json({
    success: true,
    data: member,
  });
};
