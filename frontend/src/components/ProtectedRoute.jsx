import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  // ❗ Not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Normalize roles to lowercase ALWAYS ✔
  const userRole = user.role?.toLowerCase();
  const requiredRole = role?.toLowerCase();

  // ❗ Role mismatch
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
