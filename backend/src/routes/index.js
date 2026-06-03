import userRoutes
  from "../modules/users/user.routes.js";

router.use(
  "/users",
  userRoutes
);

router.use("/auth", authRoutes);
router.use("/members", memberRoutes);
