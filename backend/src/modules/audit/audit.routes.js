import express from "express";

import {
  getAuditLogsController,
} from "./audit.controller.js";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  authorizePermissions,
} from "../../middleware/permission.middleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorizePermissions(
    "audit.view"
  ),
  getAuditLogsController
);

export default router;
