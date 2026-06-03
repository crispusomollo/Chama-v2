import jwt from "jsonwebtoken";
import crypto from "crypto";

import prisma from "../config/prisma.js";

export const generateAccessToken = (
  user,
  role
) => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.ACCESS_TOKEN_EXPIRY ||
        "15m",
    }
  );
};

export const generateRefreshToken = () => {
  return crypto
    .randomBytes(64)
    .toString("hex");
};

export const createSession = async (
  userId,
  refreshToken,
  req
) => {
  return prisma.session.create({
    data: {
      userId,
      refreshToken,
      ipAddress: req.ip,
      userAgent:
        req.headers["user-agent"],
      expiresAt: new Date(
        Date.now() +
          1000 *
            60 *
            60 *
            24 *
            30
      ),
    },
  });
};
