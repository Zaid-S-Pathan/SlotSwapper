import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
    window.location.reload();
  };

  const isLoggedIn = !!localStorage.getItem("access");

  // Function to check if current path matches the nav item
  const isActive = (path) => {
    return location.pathname === path;
  };

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
          <span 
            className={`navbar-item ${isActive("/dashboard") ? "active" : ""}`}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </span>
          <span 
            className={`navbar-item ${isActive("/marketplace") ? "active" : ""}`}
            onClick={() => navigate("/marketplace")}
          >
            Marketplace
          </span>
          <span 
            className={`navbar-item ${isActive("/requests") ? "active" : ""}`}
            onClick={() => navigate("/requests")}
          >
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
