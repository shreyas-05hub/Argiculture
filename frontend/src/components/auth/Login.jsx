import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Login Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password");
        return;
      }

      // Save user data
      localStorage.setItem("loggedInUser", JSON.stringify(data));

      // Notify Navbar
      window.dispatchEvent(new Event("storageUpdated"));

      alert("Login successful!");

      // Redirect by role
      if (data.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.role === "farmer") {
        navigate("/dashboard");
      } else {
        navigate("/marketplace");
      }
    } catch (error) {
      setError("Server error. Please try again.");
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

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
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

              <button type="submit" className="btn btn-success w-100 login-btn">
                Login
              </button>

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
