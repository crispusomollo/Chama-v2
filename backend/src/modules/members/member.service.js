import prisma from "../../config/prisma.js";

/**
 * Create member
 */
export const createMember = async (data) => {
  return await prisma.member.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || null,
      nationalId: data.nationalId || null,
      status: "PENDING",
    },
  });
};

/**
 * Get all members
 */
export const getMembers = async () => {
  return await prisma.member.findMany({
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get member by ID
 */
export const getMemberById = async (id) => {
  return await prisma.member.findUnique({
    where: { id },
  });
};


/**
 * Attach a user to a member (hybrid onboarding)
 */
export const attachUserToMember = async (memberId, userId) => {
  return await prisma.member.update({
    where: { id: memberId },
    data: {
      userId,
    },
  });
};