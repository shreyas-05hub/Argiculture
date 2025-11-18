import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';  // <-- Add this

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'enduser',
    profileImage: '',
    acres: '',
    years: '',
    cropTypes: '',
    address: '',
  });

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const base64Image = await convertToBase64(files[0]);
      setFormData({ ...formData, profileImage: base64Image });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    existingUsers.push(formData);
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("Signup successful! Redirecting to login...");
    navigate("/login");
  };

  return (
    <div className="signup-bg">
      <div className="container d-flex justify-content-center align-items-center  fade-in">
        <div className="col-md-6 col-lg-5">
          <div className="signup-card shadow-lg p-4">

            <h3 className="text-center mb-4 animate-slide">Create Account</h3>

            <form onSubmit={handleSubmit}>
              
              {/* Username */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
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
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Role */}
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  className="form-select"
                  onChange={handleChange}
                >
                  <option value="enduser">Customer</option>
                  <option value="farmer">Farmer</option>
                </select>
              </div>

              {/* Farmer-only fields */}
              {formData.role === "farmer" && (
                <>
                  {/* Profile Image */}
                  <div className="mb-3">
                    <label className="form-label">Profile Picture</label>
                    <input
                      type="file"
                      name="profileImage"
                      className="form-control"
                      accept="image/*"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Acres */}
                  <div className="mb-3">
                    <label className="form-label">Land Size (in Acres)</label>
                    <input
                      type="number"
                      name="acres"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Years */}
                  <div className="mb-3">
                    <label className="form-label">Farming Experience (Years)</label>
                    <input
                      type="number"
                      name="years"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Crop Types */}
                  <div className="mb-3">
                    <label className="form-label">Crop Types (comma-separated)</label>
                    <input
                      type="text"
                      name="cropTypes"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-success w-100">
                Sign-Up
              </button>

              <p className="text-center mt-3 ">
                Already have an account? <Link to="/login" className="login-link">Login</Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
