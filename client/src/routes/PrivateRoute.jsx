import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // or sessionStorage

  return token ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
