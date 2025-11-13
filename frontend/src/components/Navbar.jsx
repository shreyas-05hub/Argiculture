import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import logo from "../assets/farm-logo.jpg";

const Navbar = () => {
  const navigate = useNavigate();

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  const role = user?.role || "guest";

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully!");
    navigate("/authentication");
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

        {/* Toggler for Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div
          className="collapse navbar-collapse justify-content-md-center fs-5"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {/* Common links for all users */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>

            {/* Role-based routes */}
            {role === "guest" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/marketplace">
                  Marketplace
                </NavLink>
              </li>
            )}

            {role === "enduser" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/marketplace">
                  Marketplace
                </NavLink>
              </li>
            )}

            {role === "farmer" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/farmerdash">
                  Dashboard
                </NavLink>
              </li>
            )}

            {role === "admin" && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admindash">
                    Admin Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/marketplace">
                    Marketplace
                  </NavLink>
                </li>
              </>
            )}

            {/* Common Contact Page */}
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Right-side Auth Buttons */}
        <div className="d-flex align-items-center">
          {!user ? (
            <Link
              className="btn btn-success ms-lg-3 px-3 py-1"
              to="/authentication"
            >
              Login
            </Link>
          ) : (
            <button
              className="btn btn-danger ms-lg-3 px-3 py-1"
              onClick={handleLogout}
            >
              Logout ({user.username})
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
