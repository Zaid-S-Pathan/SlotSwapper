import { useNavigate } from "react-router-dom";

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
    <nav
      style={{
        background: "#282c34",
        padding: "1rem",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <span
          style={{ fontWeight: "bold", fontSize: "1.2rem", cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          SlotSwapper
        </span>
      </div>
      {isLoggedIn && (
        <div style={{ display: "flex", gap: "20px" }}>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
            Dashboard
          </span>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/marketplace")}>
            Marketplace
          </span>
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/requests")}>
            Requests
          </span>
          <span
            style={{ cursor: "pointer", color: "lightcoral" }}
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
