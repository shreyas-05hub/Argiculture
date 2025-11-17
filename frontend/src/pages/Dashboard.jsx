import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FarmerDashboard from "../components/FarmerDashboard";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Load logged-in user
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedUser) {
      navigate("/login");
      return;
    }

    // Correct role
    const userRole = loggedUser.role?.toLowerCase();
    setRole(userRole);
  }, [navigate]);

  if (role === null) {
    return <h3 className="text-center mt-4">Loading Dashboard...</h3>;
  }

  // Role based dashboards
  if (role === "farmer") return <FarmerDashboard />;
  if (role === "enduser") return <UserDashboard />;
  if (role === "admin") return <AdminDashboard />;

  return <h2>No dashboard available</h2>;
};

export default Dashboard;
