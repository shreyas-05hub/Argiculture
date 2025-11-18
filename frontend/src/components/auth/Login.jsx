import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Login Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const matchedUser = users.find(
      (u) =>
        u.username === formData.username &&
        u.password === formData.password
    );

    if (matchedUser) {
      const loggedIn = {
        ...matchedUser,
        role: matchedUser.role.toLowerCase(),
      };

      // Save logged in user
      localStorage.setItem("loggedInUser", JSON.stringify(loggedIn));

      // 🔥 Very important — Notify Navbar to update
      window.dispatchEvent(new Event("storageUpdated"));

      alert("Login successful!");

      // Redirect based on role
      if (loggedIn.role === "admin") {
        navigate("/admin-dashboard");
      } else if (loggedIn.role === "farmer") {
        navigate("/dashboard");
      } else if (loggedIn.role === "enduser") {
        navigate("/marketplace");
      } else {
        navigate("/");
      }
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-bg">
      <div className="container d-flex justify-content-center align-items-center vh-100 fade-in">
        <div className="col-md-5">
          <div className="login-card shadow-lg p-4">
            <h3 className="text-center mb-4 animate-slide">Login</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>

              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Login Button */}
              <button type="submit" className="btn btn-success w-100 login-btn">
                Login
              </button>

              {/* Signup Link */}
              <p className="text-center mt-3 text-white">
                Don’t have an account?{" "}
                <Link to="/signup" className="signup-link">
                  Sign up
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
