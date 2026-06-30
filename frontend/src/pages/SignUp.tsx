import { useState } from "react";

export default function Signup({ goToLogin }: { goToLogin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed.");
        return;
      }
      localStorage.setItem("token", data.token);
      window.location.reload();
    } catch (err) {
      setError(`Could not connect to server ${err}`);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
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
      <button onClick={handleSignup}>Sign Up</button>
      <p>
        Already have an account?{" "}
        <span style={{ cursor: "pointer", color: "blue" }} onClick={goToLogin}>
          Log in
        </span>
      </p>
    </div>
  );
}
