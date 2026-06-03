export const requireActiveMember = (req, res, next) => {
  try {
    const { memberStatus } = req.user;

    if (!req.user.memberId) {
      return res.status(403).json({
        success: false,
        message: "No member profile linked",
      });
    }

    if (memberStatus !== "ACTIVE") {
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