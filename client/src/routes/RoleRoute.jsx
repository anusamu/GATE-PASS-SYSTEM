import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(storedUser);
  const userRole = user.role?.toLowerCase();

  if (userRole !== role.toLowerCase()) {
    if (userRole === "hod") return <Navigate to="/hod" replace />;
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
