import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-brand">
        <span>Uni Mart</span>
      </Link>
      <div className="navbar-links">
        <Link to="/home">Browse</Link>
        {user ? (
          <>
            <Link to="/add-product">+ Sell</Link>
            <Link to="/my-listings">My Listings</Link>
            {user.role === "college_head" && <Link to="/college-admin">Admin Panel</Link>}
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-register">
              Register
            </Link>
          </>
        )}
        <button className="btn-theme" onClick={toggleTheme}>
          {theme === "dark" ? "Light" : "Dark"} Theme
        </button>
      </div>
    </nav>
  );
};

export default Navbar;