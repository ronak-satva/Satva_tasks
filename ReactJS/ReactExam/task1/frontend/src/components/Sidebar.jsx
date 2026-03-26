import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { hasPermission } from "../utils/permissionUtils";
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const Sidebar = () => {
    const { permissions, role } = useSelector((state) => state.auth);

    // Get the dashboard title based on user role
    const getDashboardTitle = () => {
        if (role && role.name) {
            return `${role.name} Dashboard`;
        }
        return 'Dashboard';
    };

    const menuItems = [
        {
            key: '/dashboard',
            label: <Link to="/dashboard">Dashboard</Link>,
        },
    ];

    if (hasPermission(permissions, "users", "view")) {
        menuItems.push({
            key: '/users',
            label: <Link to="/users">Users</Link>,
        });
    }

    if (hasPermission(permissions, "employees", "view")) {
        menuItems.push({
            key: '/employees',
            label: <Link to="/employees">Employees</Link>,
        });
    }

    if (hasPermission(permissions, "projects", "view")) {
        menuItems.push({
            key: '/projects',
            label: <Link to="/projects">Projects</Link>,
        });
    }

    // Only show Permissions for Admin
    if (role && role.name === 'Admin') {
        menuItems.push(
            {
                key: '/permissions',
                label: <Link to="/permissions">Permissions</Link>,
            }
        );
    }

    return (
        <Sider
            width={250}
            style={{
                background: 'linear-gradient(180deg, #1e3a5f 0%, #2d5a87 100%)',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
            }}
        >
            <div style={{ 
                padding: '24px', 
                textAlign: 'center', 
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                marginBottom: '16px'
            }}>
                <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: 0 }}>
                    {getDashboardTitle()}
                </h1>
            </div>
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['/dashboard']}
                items={menuItems}
                style={{
                    background: 'transparent',
                    borderRight: 'none',
                }}
            />
        </Sider>
    );
};

export default Sidebar;
