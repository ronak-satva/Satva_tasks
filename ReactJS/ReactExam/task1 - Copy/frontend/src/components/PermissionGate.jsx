import { useSelector } from "react-redux";
import { hasPermission } from "../utils/permissionUtils";

const PermissionGate  = ({ module, action, children }) =>{
    const { permissions } = useSelector((state) => state.auth);

    if (!hasPermission(permissions, module,action)) {
        return null;
    }

    return children;
};

export default PermissionGate;

// Hide buttons if user lacks permission