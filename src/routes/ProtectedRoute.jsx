import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) return null;
  if (!user || !token) {
    return <Navigate to="/sign-in" replace />;
  }
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/no-access" replace />;
  }
  return children;
};

export default ProtectedRoute;
