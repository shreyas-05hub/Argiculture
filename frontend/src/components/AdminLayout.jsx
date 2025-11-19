import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/AdminDash.css";

const AdminLayout = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="admin-dashboard container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className={`col-md-3 sidebar ${showSidebar ? "active" : ""}`}>
          <button
            className="close-btn d-md-none"
            onClick={() => setShowSidebar(false)}
          >
            X
          </button>

          <h3 className="admin-title">Admin Panel</h3>

          <ul className="list-group">
            <Link to="/dashboard" className="list-group-item">
              Dashboard Overview
            </Link>

            <Link to="/usermanagement" className="list-group-item">
              User Management
            </Link>

            <Link to="/reports" className="list-group-item">
              Reports
            </Link>

            <Link to="/settings" className="list-group-item">
              Settings
            </Link>
          </ul>
        </div>

        {/* Page Content */}
        <div className="col-md-9 content">
          {/* Mobile toggle button */}
          <button
            className="btn btn-outline-success d-md-none mb-3"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? "Hide Menu" : "☰ Menu"}
          </button>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
