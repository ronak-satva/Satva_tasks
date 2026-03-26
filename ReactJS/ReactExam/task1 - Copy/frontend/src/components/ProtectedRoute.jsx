import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { hasPermission } from "../utils/permissionUtils";

const ProtectedRoute = ({ children, module, action}) => {
    const { isAuthenticated, permissions} = useSelector((state) => state.auth);

    if(!isAuthenticated){
        return <Navigate to="/" />;
    }

    if (module && action && !hasPermission(permissions, module, action)) {
        return <Navigate to="/dashboard" />;
  }

  return children;

};
export default ProtectedRoute;


// Blocks Unauthorized Access.