import express from "express";

import {
  createMemberController,
  getMembersController,
  getMemberController,
  attachUserController,
  approveMember,
  suspendMember,
} from "./member.controller.js";

import { authenticate } from "../../middleware/auth.middleware.js";
import { authorizePermissions } from "../../middleware/permission.middleware.js";

const router = express.Router();

// CREATE MEMBER
router.post(
  "/",
  authenticate,
  /*authorizePermissions("member:create"),*/
  authorizePermissions("member.create"),
  createMemberController
);

// LIST MEMBERS
router.get(
  "/",
  authenticate,
  /*authorizePermissions("member:read"),*/
  authorizePermissions("member.view"),
  getMembersController
);

// GET SINGLE MEMBER
router.get(
  "/:id",
  authenticate,
  /*authorizePermissions("member:read"),*/
  authorizePermissions("member.view"),
  getMemberController
);

// ATTACH USER
router.post(
  "/:id/attach-user",
  authenticate,
  /*authorizePermissions("member:attach_user"),*/
  authorizePermissions("member.attach_user"),
  attachUserController
);


router.patch(
  "/:id/approve",
  authenticate,
  authorizePermissions("member.approve"),
  approveMember
);

router.patch(
  "/:id/suspend",
  authenticate,
  authorizePermissions("member.suspend"),
  suspendMember
);

export default router;