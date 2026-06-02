import prisma from "../config/prisma.js";

/**
 * Create a new user
 */
export const createUser = async (data) => {
  return prisma.user.create({
    data,
  });
};

/**
 * Find user by email
 */
export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Find user by id
 */
export const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};
