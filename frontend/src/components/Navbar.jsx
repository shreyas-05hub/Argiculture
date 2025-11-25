import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { toast } from "react-toastify";
import "../styles/Navbar.css";


const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const logo = "/assets/farm-logo.jpg";

  

  // Load user whenever storageUpdated event fires
  useEffect(() => {
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      setUser(storedUser);
    };

    // Run on initial load
    loadUser();

    // Listen for login/logout notification
    window.addEventListener("storageUpdated", loadUser);

    return () => {
      window.removeEventListener("storageUpdated", loadUser);
    };
  }, []);

  const role = user?.role || "guest";

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");

    // Notify all components about the change
    window.dispatchEvent(new Event("storageUpdated"));

    toast.info("Logged out successfully 👋");

    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-success" to="/">
          <img
            src={logo}
            alt="AgriLogo"
            width="40"
            height="40"
            className="d-inline-block align-text-top me-2"
          />
          AgriBuy<span className="text-primary">AI</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div
          className="collapse navbar-collapse justify-content-center fs-5"
          id="navbarNav"
        >
          <ul className="navbar-nav nav-underline-animation">
            <li className="nav-item">
              <NavLink className="nav-link animated-link" to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link animated-link" to="/about">
                About
              </NavLink>
            </li>

            {(role === "guest" || role === "enduser" || role === "admin") && (
              <li className="nav-item">
                <NavLink className="nav-link animated-link" to="/marketplace">
                  Marketplace
                </NavLink>
              </li>
            )}

            {role === "farmer" && (
              <li className="nav-item">
                <NavLink className="nav-link animated-link" to="/dashboard">
                  Dashboard
                </NavLink>
              </li>
            )}

            {role === "admin" && (
              <li className="nav-item">
                <NavLink
                  className="nav-link animated-link"
                  to="/admin-dashboard"
                >
                  Admin Dashboard
                </NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink className="nav-link animated-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* RIGHT SECTION */}
        <div className="d-flex align-items-center">
          {/* Guest */}
          {!user && (
            <Link className="btn btn-success px-3 py-1" to="/authentication">
              Login
            </Link>
          )}

          {/* Admin + Farmer */}
          {user && (role === "admin" || role === "farmer") && (
            <div className="d-flex align-items-center gap-3">
              <Link to="/profile" className="fw-bold text-dark">
                👤 {user.username}
              </Link>
              <div
                onClick={handleLogout}
                className="btn btn-success d-flex align-items-center gap-2 px-2 py-1 "
                style={{ borderRadius: "8px" }}
              >
                <i className="bi bi-box-arrow-right fs-5"></i>
              </div>
            </div>
          )}

          {/* EndUser Dropdown */}
          {user && role === "enduser" && (
            <div className="dropdown-container text-center">
              <div
                className="user-icon"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <i className="bi bi-person-lines-fill"></i> {user.username}
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu-custom">
                  <Link to="/profile" className="dropdown-item-custom">
                    <i className="bi bi-person-vcard-fill"></i> Profile
                  </Link>

                  <Link to="/orders" className="dropdown-item-custom">
                    <i className="bi bi-clock-history"></i> Orders
                  </Link>

                  <button
                    className="dropdown-item-custom text-danger rounded-pill m-auto"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
