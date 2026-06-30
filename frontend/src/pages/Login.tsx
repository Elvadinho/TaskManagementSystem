import { useState } from "react";

export default function Login({ goToSignup }: { goToSignup: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      window.location.reload(); // re-render App, token now exists
    } catch (err) {
      setError(`Could not connect to server  ${err}`);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogin}>Log in</button>
      <p>
        No account?{" "}
        <span style={{ cursor: "pointer", color: "blue" }} onClick={goToSignup}>
          Sign up
        </span>
      </p>
    </div>
  );
}
