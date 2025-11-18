import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FarmerDashboard from "../components/FarmerDashboard";
import AdminDashboard from "../components/AdminDashboard";
// import UserDashboard from "../components/UserDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // If user not logged in → redirect to Authentication page
    if (!loggedUser) {
      navigate("/authentication");
      return;
    }

    const userRole = loggedUser.role?.toLowerCase();
    setRole(userRole);
  }, [navigate]);

  if (role === null) {
    return <h3 className="text-center mt-4">Loading Dashboard...</h3>;
  }

  // Role based dashboards
  if (role === "farmer") return <FarmerDashboard />;
  // if (role === "enduser") return <UserDashboard />;
  if (role === "admin") return <AdminDashboard />;

  return (
    <h2 className="text-center mt-4 text-danger">
      No dashboard available for your role.
    </h2>
  );
};

export default Dashboard;
