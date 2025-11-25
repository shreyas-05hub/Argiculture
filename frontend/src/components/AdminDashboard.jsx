import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AdminDash.css";
import AdminLayout from "./AdminLayout";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/users/")
      .then((res) => {
        // Filter only farmers + endusers (exclude admin)
        const filtered = res.data.filter(
          (u) => u.role === "farmer" || u.role === "enduser"
        );
        setUsers(filtered);
      })
      .catch((err) => console.log("Error fetching users:", err));
  }, []);

  // Delete user
  const removeUser = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/api/users/${id}/`)
      .then(() => {
        const updated = users.filter((u) => u.id !== id);
        setUsers(updated);
      })
      .catch((err) => console.log("Error deleting user:", err));
  };

  // Count Roles
  const totalFarmers = users.filter((u) => u.role === "farmer").length;
  const totalTraders = users.filter((u) => u.role === "enduser").length;

  return (
    <AdminLayout>
      <div className="admin-dashboard container-fluid">
        <div className="row">
          {/* Main Content */}
          <div
            className="col-md-12 content container-fluid"
            style={{
              background:
                "linear-gradient(90deg, rgba(179, 230, 177, 1) 0%, rgba(179, 230, 177, 1) 88%)",
            }}
          >
            <h2>Welcome, Admin 👨‍💼</h2>

            {/* Statistics */}
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

            {/* Users Table */}
            <div className="user-table mt-4">
              <h4>All Registered Users</h4>

              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.length > 0 ? (
                      users.map((u, index) => (
                        <tr key={u.id}>
                          <td>{index + 1}</td>
                          <td>{u.username}</td>
                          <td>{u.role}</td>
                          <td>{u.email}</td>
                          <td>{u.address || "—"}</td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => removeUser(u.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No users found.
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
    </AdminLayout>
  );
};

export default AdminDashboard;