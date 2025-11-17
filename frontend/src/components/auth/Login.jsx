import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

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
      // Normalize role
      const loggedIn = {
        ...matchedUser,
        role: matchedUser.role.toLowerCase(),
      };

      localStorage.setItem("loggedInUser", JSON.stringify(loggedIn));

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
    } else {
      setError("Invalid username or password");
      toast.error("Login Failed ❌");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-lg border-0 p-4">
            <h3 className="text-center mb-4">Login</h3>

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

              {/* Submit */}
              <button type="submit" className="btn btn-success w-100">
                Login
              </button>

              <p className="text-center mt-3">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-primary">
                  Sign-up
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
