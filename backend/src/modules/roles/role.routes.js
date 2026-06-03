import express from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  authorizePermissions,
} from "../../middleware/permission.middleware.js";

import {
  getRolesController,
} from "./role.controller.js";

const router =
  express.Router();

router.get(
  "/",
  authenticate,
  authorizePermissions(
    "user.assign_role"
  ),
  getRolesController
);

export default router;
