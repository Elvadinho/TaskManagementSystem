import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <h2>Welcome, {user?.name ?? user?.email}</h2>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
