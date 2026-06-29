import jwt from "jsonwebtoken";
import AppError from "../utils/error";
import { type Request, type Response, type NextFunction } from "express";

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET is not configured", 500);
  }

  return process.env.JWT_SECRET;
};

const secret = getJwtSecret();

export const authMiddleware = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Unauthorized, no token provided" });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
