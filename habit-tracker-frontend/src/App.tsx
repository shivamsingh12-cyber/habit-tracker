import { Link, Outlet, useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2>Habit Tracker</h2>
        </Link>
        <div>
          {token ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link> |{" "}
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </header>
      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
