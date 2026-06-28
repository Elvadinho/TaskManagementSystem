import { registerUser, loginUser } from "../services/auth.service.js";

export const register = async (req, res) => {
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
  } catch (e) {
    const status = e.statusCode || 500;
    res.status(status).json({ message: e.message });
  }
};

export const login = async (req, res) => {
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
  } catch (e) {
    const status = e.statusCode || 500;
    res.status(status).json({ message: e.message });
  }
};
