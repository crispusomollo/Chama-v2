import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "./user.service.js";

/**
 * Register user
 */
export const registerUser = async (data) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await createUser({
    username: data.username,
    email: data.email,
    passwordHash: hashedPassword,
  });

  return user;
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  return { user, token };
};
