import express from "express";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  authorizePermissions,
} from "../../middleware/permission.middleware.js";

import {
  getDashboardKPIsController,
  getDashboardActivityController,
} from "./dashboard.controller.js";

const router = express.Router();

router.get(
  "/kpis",
  authenticate,
  authorizePermissions("dashboard.view"),
  getDashboardKPIsController
);

router.get(
  "/activity",
  authenticate,
  authorizePermissions("dashboard.view"),
  getDashboardActivityController
);

export default router;
