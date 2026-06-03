import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 1. Get user (identity only)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Get member (business state source of truth)
    const member = await prisma.member.findFirst({
      where: { userId: user.id },
      select: {
        id: true,
        status: true,
        role: true,
      },
    });

    req.user = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: decoded.role,

      // 🔥 NEW SOURCE OF TRUTH
      memberId: member?.id || null,
      memberStatus: member?.status || "PENDING",
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};