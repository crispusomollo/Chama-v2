import express from "express";

import {
  createMemberController,
  getMembersController,
  getMemberController,
} from "./member.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";

const router = express.Router();

// Admin + Secretary can create members
router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "SECRETARY"),
  createMemberController
);

// Admin + Treasurer + Secretary can view all members
router.get(
  "/",
  authenticate,
  authorizeRoles("ADMIN", "SECRETARY", "TREASURER"),
  getMembersController
);

// Admin + Secretary can view single member
router.get(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN", "SECRETARY"),
  getMemberController
);

export default router;
