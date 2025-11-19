import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  // Load users from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    setUsers(storedUsers);
  }, []);

  // Remove user
  const removeUser = (index) => {
    const updated = [...users];
    updated.splice(index, 1);
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2 className="mb-4">User Management</h2>

        {/* Users Table */}
        <div className="user-table mt-4">
          <h4>All Registered Users</h4>

          <div className="table-responsive mt-3">
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
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{u.username}</td>
                      <td>{u.role}</td>
                      <td>{u.email}</td>
                      <td>{u.address || "—"}</td>
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
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
