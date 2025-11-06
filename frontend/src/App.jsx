import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Requests from "./pages/Requests";
import AddEvent from "./pages/AddEvent"; 
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const isAuthenticated = !!localStorage.getItem("access");

  return (
    <Router>
      {isAuthenticated && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/add-event"                    // ✅ NEW ROUTE
          element={isAuthenticated ? <AddEvent /> : <Navigate to="/" />}
        />
        <Route
          path="/marketplace"
          element={isAuthenticated ? <Marketplace /> : <Navigate to="/" />}
        />
        <Route
          path="/requests"
          element={isAuthenticated ? <Requests /> : <Navigate to="/" />}
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
