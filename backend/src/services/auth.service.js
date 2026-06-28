import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { prisma } from "../lib/prisma.js";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT_SECRET is not configured");
    error.statusCode = 500;
    throw error;
  }

  return process.env.JWT_SECRET;
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = async (data) => {
  const { name, email, password } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ id: user.id }, getJwtSecret(), {
    expiresIn: "6h",
  });

  return { user: sanitizeUser(user), token };
};

export const loginUser = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid password");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({ id: user.id }, getJwtSecret(), {
    expiresIn: "3h",
  });

  return { user: sanitizeUser(user), token };
};
