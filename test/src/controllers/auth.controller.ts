import { registerUser, loginUser } from "../services/auth.service.js";
import { type Request, type Response } from "express";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  try {
    const { user, token } = await registerUser({
      name: name,
      email: email,
      password: password,
    });

    res.status(201).json({ user, token });
  } catch (e: unknown) {
    const error = e as { statusCode?: number; message?: string };
    const status = error.statusCode || 500;
    res
      .status(status)
      .json({ message: error.message || "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const { user, token } = await loginUser({
      email: email,
      password: password,
    });

    res.status(200).json({ user, token });
  } catch (e: unknown) {
    const error = e as { statusCode?: number; message?: string };
    const status = error.statusCode || 500;
    res
      .status(status)
      .json({ message: error.message || "Internal server error" });
  }
};
