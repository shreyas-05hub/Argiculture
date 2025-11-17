import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import logo from "../assets/farm-logo.jpg";
import { toast } from "react-toastify";
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Load logged-in user during first render
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(storedUser);
  }, []);

  const role = user?.role || "guest";

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    toast.info("Logged out successfully 👋");

    setTimeout(() => {
      navigate("/");
      window.location.reload();
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
        <div className="collapse navbar-collapse justify-content-center fs-5" id="navbarNav">
          <ul className="navbar-nav nav-underline-animation">

            <li className="nav-item">
              <NavLink className="nav-link animated-link" to="/">Home</NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link animated-link" to="/about">About</NavLink>
            </li>

            {(role === "guest" || role === "enduser" || role === "admin") && (
              <li className="nav-item">
                <NavLink className="nav-link animated-link" to="/marketplace">Marketplace</NavLink>
              </li>             
            )}

            {(role === "farmer" || role ==="enduser") && (
              <li className="nav-item">
                <NavLink className="nav-link animated-link" to="/dashboard">Dashboard</NavLink>
              </li>
            )}

            {role === "admin" && (
              <li className="nav-item">
                <NavLink className="nav-link animated-link" to="/admin-dashboard">Admin Dashboard</NavLink>
              </li>
            )}

            <li className="nav-item">
              <NavLink className="nav-link animated-link" to="/contact">Contact</NavLink>
            </li>

          </ul>
        </div>

        {/* Right section */}
        <div className="d-flex align-items-center">

          {!user ? (
            <Link className="btn btn-success px-3 py-1" to="/authentication">
              Login
            </Link>
          ) : (
            <div className="dropdown-container">
              <div className="user-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
                👤 {user.username}
              </div>

              {dropdownOpen && (
                <div className="dropdown-menu-custom">
                  <Link to="/profile" className="dropdown-item-custom">Profile</Link>
                  <Link to="/orders" className="dropdown-item-custom">Orders</Link>

                  <button className="dropdown-item-custom text-danger" onClick={handleLogout}>
                    Logout
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
