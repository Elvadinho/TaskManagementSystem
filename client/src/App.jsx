import { useMemo, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const initialForms = {
  login: {
    email: "",
    password: "",
  },
  register: {
    name: "",
    email: "",
    password: "",
  },
};

function App() {
  const [mode, setMode] = useState("login");
  const [forms, setForms] = useState(initialForms);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const [session, setSession] = useState(() => {
    const storedUser = localStorage.getItem("taskflow_user");
    const storedToken = localStorage.getItem("taskflow_token");

    if (!storedUser || !storedToken) {
      return null;
    }

    try {
      return {
        user: JSON.parse(storedUser),
        token: storedToken,
      };
    } catch {
      localStorage.removeItem("taskflow_user");
      localStorage.removeItem("taskflow_token");
      return null;
    }
  });

  const activeForm = forms[mode];
  const isRegistering = mode === "register";
  const passwordLength = activeForm.password.length;
  const passwordStrength = useMemo(() => {
    if (!isRegistering) return null;
    if (passwordLength >= 10) return "Strong";
    if (passwordLength >= 6) return "Good";
    if (passwordLength > 0) return "Too short";
    return "Required";
  }, [isRegistering, passwordLength]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setMessage(null);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForms((currentForms) => ({
      ...currentForms,
      [mode]: {
        ...currentForms[mode],
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(activeForm),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      localStorage.setItem("taskflow_token", data.token);
      localStorage.setItem("taskflow_user", JSON.stringify(data.user));
      setSession(data);
      setMessage({
        type: "success",
        text: isRegistering
          ? "Account created. Welcome to your workspace."
          : "Welcome back. You are signed in.",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.message === "Failed to fetch"
            ? "Could not reach the backend. Make sure it is running on port 3000."
            : error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");
    setSession(null);
    setMessage(null);
  };

  return (
    <main className="auth-shell">
      <section className="brand-panel" aria-label="Task management preview">
        <nav className="topbar" aria-label="Application">
          <div className="brand-mark" aria-hidden="true">
            <span></span>
          </div>
          <span className="brand-name">TaskFlow</span>
        </nav>

        <div className="hero-copy">
          <p className="eyebrow">Plan with calm</p>
          <h1>Turn busy days into focused progress.</h1>
          <p>
            Sign in to organize tasks, deadlines, priorities, and categories in
            one clean workspace.
          </p>
        </div>

        <div className="dashboard-preview" aria-hidden="true">
          <div className="preview-header">
            <span>Today</span>
            <strong>7 tasks</strong>
          </div>
          <div className="preview-grid">
            <article>
              <span className="status-dot planned"></span>
              <p>Plan sprint tasks</p>
              <small>09:30</small>
            </article>
            <article>
              <span className="status-dot active"></span>
              <p>Review backend API</p>
              <small>11:00</small>
            </article>
            <article>
              <span className="status-dot done"></span>
              <p>Ship auth screens</p>
              <small>14:15</small>
            </article>
          </div>
        </div>
      </section>

      <section className="auth-panel" aria-label="Authentication">
        {session ? (
          <div className="session-card">
            <span className="success-ring" aria-hidden="true"></span>
            <p className="eyebrow">Authenticated</p>
            <h2>Welcome, {session.user.name}</h2>
            <p>
              Your JWT is saved locally and ready to be sent as a Bearer token
              for protected requests.
            </p>
            <dl>
              <div>
                <dt>Email</dt>
                <dd>{session.user.email}</dd>
              </div>
              <div>
                <dt>User ID</dt>
                <dd>{session.user.id}</dd>
              </div>
            </dl>
            <button
              className="primary-action"
              type="button"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="auth-card">
            <div className="mode-switch" role="tablist" aria-label="Auth mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                onClick={() => handleModeChange("login")}
              >
                Login
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "register"}
                onClick={() => handleModeChange("register")}
              >
                Register
              </button>
            </div>

            <div className="form-heading">
              <p className="eyebrow">
                {isRegistering ? "Start fresh" : "Welcome back"}
              </p>
              <h2>
                {isRegistering
                  ? "Create your account"
                  : "Login to your account"}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {isRegistering && (
                <label>
                  <span>Name</span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={activeForm.name}
                    onChange={handleInputChange}
                    placeholder="Ada Lovelace"
                    required
                  />
                </label>
              )}

              <label>
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={activeForm.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  autoComplete={
                    isRegistering ? "new-password" : "current-password"
                  }
                  value={activeForm.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  minLength={isRegistering ? 6 : undefined}
                  required
                />
              </label>

              {isRegistering && (
                <div className="password-meter" aria-live="polite">
                  <span
                    style={{
                      width: `${Math.min((passwordLength / 10) * 100, 100)}%`,
                    }}
                  ></span>
                  <small>Password strength: {passwordStrength}</small>
                </div>
              )}

              {message && (
                <p className={`form-message ${message.type}`} role="status">
                  {message.text}
                </p>
              )}

              <button
                className="primary-action"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Please wait..."
                  : isRegistering
                    ? "Create account"
                    : "Login"}
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
