const Dashboard = () => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  return (
    <div>
      <h2>You are logged in!</h2>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

export default Dashboard;
