import { Card, Typography, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const { Title, Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Get role-specific welcome message
  const getWelcomeMessage = () => {
    if (role && role.name) {
      const roleName = role.name;
      if (roleName === 'Admin') {
        return 'Welcome to Admin Panel - You have full access to manage all sections of the application.';
      } else if (roleName === 'HR') {
        return 'Welcome to HR Dashboard - You can manage employees and view relevant data.';
      } else if (roleName === 'Manager') {
        return 'Welcome to Manager Dashboard - You can manage projects and view team information.';
      } else if (roleName === 'Supervisor') {
        return 'Welcome to Supervisor Dashboard - You can view and edit employee information.';
      } else {
        return `Welcome to ${roleName} Dashboard`;
      }
    }
    return 'Welcome to Dashboard';
  };

  // Get role-specific subtitle
  const getSubtitle = () => {
    if (role && role.name) {
      return `Logged in as ${user?.name || 'User'} (${role.name})`;
    }
    return 'Welcome to the application';
  };

  return (
    <div style={{ marginLeft: '260px', padding: '30px', minHeight: '100vh', background: '#f5f7fa' }}>
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1e3a5f' }}>{role?.name || 'Dashboard'}</Title>
            <Text type="secondary">{getSubtitle()}</Text>
          </div>
          <Space>
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Space>
        </div>
      </Card>
      
      <Card>
        <Title level={3} style={{ color: '#1e3a5f', marginBottom: '16px' }}>{getWelcomeMessage()}</Title>
        <Text style={{ fontSize: '16px', color: '#666', lineHeight: '1.6' }}>
          Use the sidebar navigation to access different sections of the application.
          <br /><br />
          {role?.name === 'Admin' && 'You can manage Users, Employees, Projects, Roles, and Permissions from the menu.'}
          {role?.name === 'HR' && 'You can manage Employees from the menu.'}
          {role?.name === 'Manager' && 'You can manage Projects from the menu.'}
          {role?.name === 'Supervisor' && 'You can view and edit Employee information from the menu.'}
        </Text>
      </Card>
    </div>
  );
};

export default Dashboard;
