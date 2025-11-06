import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
    window.location.reload();
  };

  const isLoggedIn = !!localStorage.getItem("access");

  return (
    <nav className="navbar">
      <div>
        <span
          className="navbar-brand"
          onClick={() => navigate("/dashboard")}
        >
          SlotSwapper
        </span>
      </div>
      {isLoggedIn && (
        <div className="navbar-menu">
          <span className="navbar-item" onClick={() => navigate("/dashboard")}>
            Dashboard
          </span>
          <span className="navbar-item" onClick={() => navigate("/marketplace")}>
            Marketplace
          </span>
          <span className="navbar-item" onClick={() => navigate("/requests")}>
            Requests
          </span>
          <span
            className="navbar-logout"
            onClick={handleLogout}
          >
            Logout
          </span>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
