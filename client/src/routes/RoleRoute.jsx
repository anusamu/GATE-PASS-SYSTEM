import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // "staff", "hod", "admin"

  if (!token) return <Navigate to="/" replace />;

  return userRole === role ? children : <Navigate to="/dashboard" replace />;
};

export default RoleRoute;
