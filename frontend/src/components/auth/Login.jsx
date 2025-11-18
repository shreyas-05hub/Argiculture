import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';   // <-- Add this line to import CSS

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        role: matchedUser.role.toLowerCase()
      };

      localStorage.setItem("loggedInUser", JSON.stringify(loggedIn));
      alert("Login successful!");
      navigate("/dashboard");
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
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.username}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success w-100 login-btn">
                Login
              </button>

              <p className="text-center mt-3 text-white">
                Don’t have an account? <Link to="/signup" className="signup-link">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
