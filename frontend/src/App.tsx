import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [page, setPage] = useState("login");
  const token = localStorage.getItem("token");

  if (token) return <Dashboard />;
  if (page === "login") return <Login goToSignup={() => setPage("signup")} />;
  return <Signup goToLogin={() => setPage("Login")} />;
}
