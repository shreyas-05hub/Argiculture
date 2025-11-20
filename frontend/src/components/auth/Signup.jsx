import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromURL = searchParams.get("role") || "enduser";

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_no: "",
    email: "",
    password: "",
    role: roleFromURL,
  });

  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form — Sends data to Django
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 201) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        setError(data.error || "Signup failed.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="signup-bg">
      <div className="container d-flex justify-content-center align-items-center fade-in">
        <div className="col-md-6 col-lg-5">
          <div className="signup-card shadow-lg p-4">
            <h3 className="text-center mb-4 animate-slide">Create Account</h3>

            {error && <p className="text-danger text-center">{error}</p>}

            <form onSubmit={handleSubmit}>

              {/* First Name */}
              <div className="mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Last Name */}
              <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Mobile Number */}
              <div className="mb-3">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  name="mobile_no"
                  className="form-control"
                  value={formData.mobile_no}
                  onChange={handleChange}
                  required
                />
              </div>

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

              {/* Role */}
              <div className="mb-3">
                <label className="form-label">Sign Up As</label>
                <select
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="enduser">Customer</option>
                  <option value="farmer">Farmer</option>
                </select>
              </div>

              <button type="submit" className="btn btn-success w-100">
                Sign-Up
              </button>

              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/login" className="login-link">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
