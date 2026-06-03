import express from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  authorizePermissions,
} from "../../middleware/permission.middleware.js";

import {
  createMemberController,
  approveMemberController,
  activateMemberController,
  rejectMemberController,
} from "./member.workflow.controller.js";

const router = express.Router();

/**
 * Create member → PENDING
 */
router.post(
  "/",
  authenticate,
  authorizePermissions("member.create"),
  createMemberController
);

/**
 * Approve member → APPROVED
 */
router.patch(
  "/:memberId/approve",
  authenticate,
  authorizePermissions("member.approve"),
  approveMemberController
);

/**
 * Activate member → ACTIVE
 */
router.patch(
  "/:memberId/activate",
  authenticate,
  authorizePermissions("member.activate"),
  activateMemberController
);

/**
 * Reject member → REJECTED
 */
router.patch(
  "/:memberId/reject",
  authenticate,
  authorizePermissions("member.approve"),
  rejectMemberController
);

export default router;
