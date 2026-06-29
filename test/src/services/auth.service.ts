import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../utils/hash.js";
import prisma from "../lib/prisma.js";
import AppError from "../utils/error.js";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }

  return process.env.JWT_SECRET;
};

interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

interface LoginUser {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterUser) => {
  const { name, email, password } = data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AppError("Email already in use", 409);
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

  return { user, token };
};

export const loginUser = async (data: LoginUser) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new AppError("User not found", 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid password", 401);
  }

  const token = jwt.sign({ id: user.id }, getJwtSecret(), {
    expiresIn: "6h",
  });

  return { user, token };
};
