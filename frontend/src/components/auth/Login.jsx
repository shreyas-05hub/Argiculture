<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';   // <-- Add this line to import CSS
=======
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
>>>>>>> 27d26d4331eba200b24a9fe0fe48a1aa674184c4

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
<<<<<<< HEAD
=======
      // Normalize role
>>>>>>> 27d26d4331eba200b24a9fe0fe48a1aa674184c4
      const loggedIn = {
        ...matchedUser,
        role: matchedUser.role.toLowerCase(),
      };

      localStorage.setItem("loggedInUser", JSON.stringify(loggedIn));
<<<<<<< HEAD
      alert("Login successful!");
      navigate("/dashboard");
=======

      toast.success(`Welcome back, ${loggedIn.username}! 🌾`);

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
>>>>>>> 27d26d4331eba200b24a9fe0fe48a1aa674184c4
    } else {
      setError("Invalid username or password");
      toast.error("Login Failed ❌");
    }
  };

  return (
    <div className="login-bg">
      <div className="container d-flex justify-content-center align-items-center vh-100 fade-in">
        <div className="col-md-5">
<<<<<<< HEAD
          <div className="login-card shadow-lg p-4">
            <h3 className="text-center mb-4 animate-slide">Login</h3>
=======
          <div className="card shadow-lg border-0 p-4">
            <h3 className="text-center mb-4">Login</h3>
>>>>>>> 27d26d4331eba200b24a9fe0fe48a1aa674184c4

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

<<<<<<< HEAD
              <button type="submit" className="btn btn-success w-100 login-btn">
                Login
              </button>

              <p className="text-center mt-3 text-white">
                Don’t have an account? <Link to="/signup" className="signup-link">Sign up</Link>
=======
              {/* Submit */}
              <button type="submit" className="btn btn-success w-100">
                Login
              </button>

              <p className="text-center mt-3">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-primary">
                  Sign-up
                </Link>
>>>>>>> 27d26d4331eba200b24a9fe0fe48a1aa674184c4
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
