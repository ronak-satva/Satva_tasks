import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, editRole } from "../features/roles/roleSlice";
import { refreshUserPermissions } from "../features/auth/authSlice";
import { Card, Typography, Tag, Row, Col, Spin, Checkbox, Button, message } from 'antd';

const { Title, Text } = Typography;

const Permissions = () => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.roles);
  const { user, role: currentUserRole } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [permissionsData, setPermissionsData] = useState({});

  // Check if current user is Admin
  const isAdmin = currentUserRole && currentUserRole.name === 'Admin';

  useEffect(() => {
    dispatch(fetchRoles()).finally(() => setLoading(false));
  }, [dispatch]);

  // Initialize permissions data when roles load
  useEffect(() => {
    if (roles && roles.length > 0) {
      const initialData = {};
      roles.forEach(role => {
        initialData[role.id] = { ...role.permissions };
      });
      setPermissionsData(initialData);
    }
  }, [roles]);

  const getPermissionColor = (perm) => {
    switch (perm) {
      case 'view': return 'blue';
      case 'add': return 'green';
      case 'edit': return 'orange';
      case 'delete': return 'red';
      default: return 'default';
    }
  };

  const allModules = ['users', 'employees', 'projects', 'roles'];
  const allActions = ['view', 'add', 'edit', 'delete'];

  const handleCheckboxChange = (roleId, module, action, checked) => {
    setPermissionsData(prev => {
      const rolePermissions = { ...prev[roleId] };
      let modulePerms = [...(rolePermissions[module] || [])];
      
      if (checked) {
        if (!modulePerms.includes(action)) {
          modulePerms.push(action);
        }
        // If edit or delete is selected, automatically select view
        if ((action === 'edit' || action === 'delete') && !modulePerms.includes('view')) {
          modulePerms.push('view');
        }
      } else {
        const index = modulePerms.indexOf(action);
        if (index > -1) {
          modulePerms.splice(index, 1);
        }
        // If view is unchecked, also uncheck edit and delete
        if (action === 'view') {
          modulePerms = modulePerms.filter(perm => perm !== 'edit' && perm !== 'delete');
        }
      }
      
      rolePermissions[module] = modulePerms;
      return { ...prev, [roleId]: rolePermissions };
    });
  };

  const isChecked = (roleId, module, action) => {
    const rolePermissions = permissionsData[roleId];
    if (!rolePermissions || !rolePermissions[module]) return false;
    return rolePermissions[module].includes(action);
  };

  const handleSave = () => {
    // Save all role permissions (excluding Admin role)
    const savePromises = roles
      .filter(role => role.name !== 'Admin') // Don't save Admin permissions
      .map(role => {
        return dispatch(editRole({
          id: role.id,
          data: {
            ...role,
            permissions: permissionsData[role.id]
          }
        }));
    });

    Promise.all(savePromises).then(() => {
      message.success('Permissions saved successfully!');
      setEditMode(false);
      dispatch(fetchRoles());
      // Rehydrate localStorage and reducer state with latest role access data from DB
      dispatch(refreshUserPermissions(user));
    });
  };

  if (loading) {
    return (
      <div className="ml-[260px] p-8 min-h-screen bg-gray-100 text-center pt-24">
        <Spin size="large" />
      </div>
    );
  }

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="ml-[260px] p-8 min-h-screen bg-gray-100">
        <Card>
          <Title level={4}  className="!text-red-500">Access Denied</Title>
          <Text>You do not have permission to view this page. Only administrators can access the Permissions page.</Text>
        </Card>
      </div>
    );
  }

  return (
    <div className="ml-[260px] p-8 min-h-screen bg-gray-100">
      <Card style={{ marginBottom: '24px' }}>
        <div className="flex justify-between items-center">
          <div>
<Title level={2} className="!mb-0 !text-blue-900">Permissions</Title>
            <Text type="secondary">Manage role-based permissions</Text>
          </div>
          <div>
            {!editMode ? (
              <Button type="primary" onClick={() => setEditMode(true)}>
                Edit Permissions
              </Button>
            ) : (
              <>
                <Button style={{ marginRight: '8px' }} onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button type="primary" onClick={handleSave}>
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {roles && roles.map((role) => {
          const isRoleAdmin = role.name === 'Admin';
          
          return (
            <Col xs={24} lg={12} key={role.id}>
              <Card 
                title={`${role.name} Role`}
                extra={isRoleAdmin && <Tag color="red">Cannot be edited</Tag>}
                bordered={false}
                className="shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
              >
                <Row gutter={[16, 12]}>
                  {allModules.map(module => (
                    <Col span={24} key={module}>
                      <div style={{ marginBottom: '8px' }}>
                        <Text strong className="capitalize">{module}</Text>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {allActions.map(action => {
                          const checked = isChecked(role.id, module, action);
                          const isDisabled = !editMode || isRoleAdmin; // Disable for Admin role
                          
                          return (
                            <Checkbox
                              key={`${module}-${action}`}
                              checked={checked}
                              onChange={(e) => handleCheckboxChange(role.id, module, action, e.target.checked)}
                              disabled={isDisabled}
                             
                            >
                              <Tag color={getPermissionColor(action)} className="!m-0">
                                {action}
                              </Tag>
                            </Checkbox>
                          );
                        })}
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Permissions;
