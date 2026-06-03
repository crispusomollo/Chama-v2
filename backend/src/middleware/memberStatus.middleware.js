export const requireActiveMember = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        success: false,
        message: "Member account is not active",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};
