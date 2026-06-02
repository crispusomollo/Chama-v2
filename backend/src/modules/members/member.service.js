import prisma from "../../config/prisma.js";

export const createMember = async (data) => {
  const member = await prisma.member.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      nationalId: data.nationalId,
      status: "PENDING",
    },
  });

  return member;
};

export const getAllMembers = async () => {
  return prisma.member.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const getMemberById = async (id) => {
  return prisma.member.findUnique({
    where: { id },
  });
};
