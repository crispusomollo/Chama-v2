import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import prisma from "../../config/prisma.js";

import {
  generateAccessToken,
  generateRefreshToken,
  createSession,
} from "../../utils/jwt.js";

import { logAudit }
  from "../../utils/audit.js";

export const registerController = async (
  req,
  res,
  next
) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    const existingUser =
      await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username },
          ],
        },
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Email or username already exists",
      });
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
      },
    });

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (
  req,
  res,
  next
) => {
  try {
    const { email, password } =
      req.body;

    const user =
      await prisma.user.findUnique({
        where: { email },
      });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    if (
        user.lockedUntil &&
        user.lockedUntil > new Date()
      ) {
          return res.status(423).json({
          success: false,
          message:
            "Account temporarily locked. Try again later.",
      });
    }


    const validPassword =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    /*if (!validPassword) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }*/

    if (!validPassword) {
      const attempts =
        user.failedLoginAttempts + 1;

      const updateData = {
        failedLoginAttempts: attempts,
    };

      if (attempts >= 5) {
        updateData.lockedUntil =
          new Date(
            Date.now() +
              30 * 60 * 1000
        );
      }

      if (attempts >= 5) {
        await logAudit({
          userId: user.id,
          action: "ACCOUNT_LOCKED",
          entity: "AUTH",
          req,
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }


      await prisma.user.update({
        where: { id: user.id },
        data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    const userRole =
      await prisma.userRole.findFirst({
        where: {
          userId: user.id,
        },
        include: {
          role: true,
        },
      });

    const roleName =
      userRole?.role?.name ??
      "SYSTEM_OPERATOR";

    const accessToken =
      generateAccessToken(
        user,
        roleName
      );

    /*const refreshToken =
      generateRefreshToken();

    await createSession(
      user.id,
      refreshToken,
      req
    );
    */

    const refreshToken =
        generateRefreshToken();

    const refreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    await createSession(
        user.id,
        refreshTokenHash,
        req
    );

    await logAudit({
      userId: user.id,
      action: "LOGIN",
      entity: "AUTH",
      req,
    });

    return res.json({
      success: true,
      message: "Login successful",
      data: {
        user,
        role: roleName,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const unlockUserController =
  async (req, res, next) => {
    try {
      const { userId } = req.params;

      const user =
        await prisma.user.update({
          where: { id: userId },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
          },
        });

      await logAudit({
        userId: req.user.userId,
        action: "UNLOCK_USER",
        entity: "USER",
        entityId: user.id,
        req,
      });

      res.json({
        success: true,
        message:
          "User unlocked successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  

export const refreshTokenController =
  async (req, res, next) => {
    try {
      const { refreshToken } =
        req.body;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message:
            "Refresh token required",
        });
      }

      /*const session =
        await prisma.session.findFirst({
          where: {
            refreshToken,
          },
          include: {
            user: true,
          },
        });
        */

      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      const session =
        await prisma.session.findFirst({
        where: {
        refreshToken: tokenHash,
        },
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid refresh token",
        });
      }

      if (
        session.expiresAt <
        new Date()
      ) {
        return res.status(401).json({
          success: false,
          message:
            "Refresh token expired",
        });
      }

      const userRole =
        await prisma.userRole.findFirst({
          where: {
            userId: session.user.id,
          },
          include: {
            role: true,
          },
        });

      const roleName =
        userRole?.role?.name ??
        "SYSTEM_OPERATOR";

      const accessToken =
        generateAccessToken(
          session.user,
          roleName
        );

      const newRefreshToken =
        generateRefreshToken();

      await prisma.session.update({
        where: {
          id: session.id,
        },
        data: {
          refreshToken:
            newRefreshToken,
        },
      });

      return res.json({
        success: true,
        data: {
          accessToken,
          refreshToken:
            newRefreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

export const logoutController =
  async (req, res, next) => {
    try {
      const { refreshToken } =
        req.body;

      /*  
      await prisma.session.deleteMany({
        where: {
          refreshToken,
        },
      });
      */

      const tokenHash = crypto
          .createHash("sha256")
          .update(refreshToken)
          .digest("hex");

        await prisma.session.deleteMany({
          where: {
          refreshToken: tokenHash,
        },
      });

      await logAudit({
        userId: req.user?.userId,
        action: "LOGOUT",
        entity: "AUTH",
        req,
      });

      return res.json({
        success: true,
        message:
          "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  };

export const logoutAllController =
  async (req, res, next) => {
    try {
      await prisma.session.deleteMany({
        where: {
          userId:
            req.user.userId,
        },
      });

      return res.json({
        success: true,
        message:
          "Logged out from all devices",
      });
    } catch (error) {
      next(error);
    }
  };

export const getMeController =
  async (req, res) => {
    return res.json({
      success: true,
      user: req.user,
    });
  };


  export const getSessionsController =
  async (req, res, next) => {
    try {
      const sessions =
        await prisma.session.findMany({
          where: {
            userId: req.user.userId,
          },
          select: {
                  id: true,
                  ipAddress: true,
                  userAgent: true,
                  expiresAt: true,
                  createdAt: true,
                  },
          orderBy: {
            createdAt: "desc",
          },
        });

      return res.json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      next(error);
    }
  };