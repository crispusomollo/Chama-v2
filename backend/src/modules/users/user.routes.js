import express from "express";

import {
  getUsersController,
  assignRoleController,
  removeRoleController,
} from "./user.controller.js";

import {
  authenticate,
} from "../../middleware/auth.middleware.js";

import {
  authorizePermissions,
} from "../../middleware/permission.middleware.js";

const router = express.Router();

/*router.get(
  "/",
  authenticate,
  authorizePermissions("user.read"),
  getUsersController
);*/

router.get(
  "/",
  authenticate,
  authorizePermissions("user.view"),
  getUsersController
);

router.post(
  "/:userId/roles",
  authenticate,
  authorizePermissions("user.assign_role"),
  assignRoleController
);

router.delete(
  "/:userId/roles/:roleId",
  authenticate,
  authorizePermissions("user.remove_role"),
  removeRoleController
);

export default router;
