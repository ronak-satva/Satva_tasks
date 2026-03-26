import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, allowedRole }) {
    const { user } = useSelector((state) => state.auth);
    if (user?.role !== allowedRole) {
    return <Navigate to="/not-authorized" replace />;
  }

  return children;
}