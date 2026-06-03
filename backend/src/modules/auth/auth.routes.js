import express from "express";

import {
  registerController,
  loginController,
  getMeController,
  refreshTokenController,
  logoutController,
  logoutAllController,
  getSessionsController,
  unlockUserController,
} from "./auth.controller.js";

import { authenticate }
  from "../../middleware/auth.middleware.js";

import {
  authorizePermissions,
} from "../../middleware/permission.middleware.js";

/*import {
  getUserPermissions,
  getUserRoles,
} from "../../services/security/permission.service.js";*/

const router = express.Router();

console.log("AUTH ROUTES LOADED");

router.post(
  "/register",
  registerController
);

router.post(
  "/login",
  loginController
);

router.get(
  "/me",
  authenticate,
  getMeController
);

router.post(
  "/refresh",
  refreshTokenController
);

router.post(
  "/logout",
  logoutController
);

router.post(
  "/logout-all",
  authenticate,
  logoutAllController
);

router.get(
  "/sessions",
  authenticate,
  getSessionsController
);

router.post(
  "/users/:userId/unlock",
  authenticate,
  authorizePermissions(
    "user.unlock"
  ),
  unlockUserController
);

/*router.get(
  "/permissions",
  authenticate,
  getMyPermissionsController
);*/


export default router;
