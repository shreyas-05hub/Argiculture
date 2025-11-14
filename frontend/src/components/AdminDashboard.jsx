import React, { useEffect, useState } from "react";
import "../styles/AdminDash.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  const removeUser = (index) => {
    const updated = [...users];
    updated.splice(index, 1);
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  const totalFarmers = users.filter((u) => u.role === "Farmer").length;
  const totalTraders = users.filter((u) => u.role === "Trader").length;

  return (
    <div className="admin-dashboard container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className={`col-md-3 sidebar ${showSidebar ? "active" : ""}`}>
            <button className="close-btn d-md-none" onClick={()=>setShowSidebar(false)}>X</button>
          <h3 className="admin-title">Admin Panel</h3>
          <ul className="list-group">
            <li className="list-group-item">Dashboard Overview</li>
            <li className="list-group-item">User Management</li>
            <li className="list-group-item">Reports</li>
            <li className="list-group-item">Settings</li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="col-md-9 content">
          {/* Mobile menu toggle button */}
          <button
            className="btn btn-outline-success d-md-none mb-3"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? "Hide Menu" : "☰ Menu"}
          </button>

          <h2>Welcome, Admin 👨‍💼</h2>
          <div className="row stats">
            <div className="col-md-4 col-sm-12 mb-3">
              <div className="card stat-card">
                <h5>Total Farmers</h5>
                <p>{totalFarmers}</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-12 mb-3">
              <div className="card stat-card">
                <h5>Total Traders</h5>
                <p>{totalTraders}</p>
              </div>
            </div>
            <div className="col-md-4 col-sm-12 mb-3">
              <div className="card stat-card">
                <h5>Total Users</h5>
                <p>{users.length}</p>
              </div>
            </div>
          </div>

          <div className="user-table mt-4">
            <h4>All Registered Users</h4>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{u.name}</td>
                        <td>{u.role}</td>
                        <td>{u.email}</td>
                        <td>{u.location || "—"}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => removeUser(index)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
