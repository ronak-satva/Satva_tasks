import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, addUser, editUser, deleteUser } from "../features/users/userSlice";
import { fetchRoles } from "../features/roles/roleSlice";
import { useEffect, useState } from "react";
import { Table, Button, Card, Typography, Drawer, Form, Input, Select, message, Tag } from 'antd';
import PermissionGate from "../components/PermissionGate";
import { hasPermission } from "../utils/permissionUtils";

const { Title } = Typography;
const { Option } = Select;

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.list);
  const roles = useSelector((state) => state.roles.roles);
  const { permissions } = useSelector((state) => state.auth);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
  }, [dispatch]);

  const getRoleName = (roleId) => {
    if (!roleId) return 'Unknown';
    const role = roles.find(r => String(r.id) === String(roleId));
    return role ? role.name : 'Unknown';
  };

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'Admin': return 'red';
      case 'HR': return 'blue';
      case 'Supervisor': return 'orange';
      case 'Manager': return 'green';
      default: return 'default';
    }
  };

  const onFinish = (values) => {
    dispatch(addUser({
      ...values,
      roleId: values.roleId ? parseInt(values.roleId) : null
    })).then(() => {
      message.success('User added successfully!');
      setDrawerVisible(false);
      form.resetFields();
      dispatch(fetchUsers());
    });
  };

  const handleEdit = (record) => {
    if (!hasPermission(permissions, "users", "edit")) return;
    setSelectedUser(record);
    editForm.setFieldsValue({
      id: record.id,
      name: record.name,
      email: record.email,
      password: record.password,
      roleId: record.roleId ? String(record.roleId) : null
    });
    setEditDrawerVisible(true);
  };

  const handleDelete = (id) => {
    if (!hasPermission(permissions, "users", "delete")) return;
    dispatch(deleteUser(id)).then(() => {
      message.success('User deleted successfully!');
      dispatch(fetchUsers());
    });
  };

  const onEditFinish = (values) => {
    dispatch(editUser({
      id: selectedUser.id,
      data: {
        ...values,
        roleId: values.roleId ? parseInt(values.roleId) : null
      }
    })).then(() => {
      message.success('User updated successfully!');
      setEditDrawerVisible(false);
      setSelectedUser(null);
      editForm.resetFields();
      dispatch(fetchUsers());
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'roleId',
      key: 'role',
      render: (roleId) => {
        const roleName = getRoleName(roleId);
        return <Tag color={getRoleColor(roleName)}>{roleName}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        // Prevent edit and delete for admin user (id === "1")
        const isAdmin = record.id === "1";
        
        return (
          <>
            <PermissionGate module="users" action="edit">
              <Button 
                type="link" 
                onClick={() => handleEdit(record)}
                style={{ color: isAdmin ? '#d9d9d9' : '#faad14', cursor: isAdmin ? 'not-allowed' : 'pointer' }}
                disabled={isAdmin}
              >
                Edit
              </Button>
            </PermissionGate>
            <PermissionGate module="users" action="delete">
              <Button 
                type="link" 
                danger 
                onClick={() => handleDelete(record.id)}
                disabled={isAdmin}
              >
                Delete
              </Button>
            </PermissionGate>
          </>
        );
      },
    },
  ];

  return (
    <div style={{ marginLeft: '260px', padding: '30px', minHeight: '100vh', background: '#f5f7fa' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#1e3a5f' }}>Users</Title>
          <PermissionGate module="users" action="add">
            <Button type="primary" onClick={() => setDrawerVisible(true)}>Add User</Button>
          </PermissionGate>
        </div>
        
        <Table 
          dataSource={users} 
          columns={columns} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title="Add New User"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="ID"
            name="id"
            rules={[{ required: true, message: 'Please enter user ID' }]}
          >
            <Input type="number" placeholder="Enter user ID" />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter user name' }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter user email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter user email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="roleId"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select a role">
              {roles.map(role => (
                <Option key={role.id} value={role.id}>{role.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="Edit User"
        placement="right"
        onClose={() => setEditDrawerVisible(false)}
        open={editDrawerVisible}
        width={400}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={onEditFinish}
        >
          <Form.Item
            label="ID"
            name="id"
          >
            <Input disabled placeholder="User ID" />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter user name' }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter user email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter user email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="roleId"
            rules={[{ required: true, message: 'Please select a role' }]}
          >
            <Select placeholder="Select a role">
              {roles.map(role => (
                <Option key={role.id} value={role.id}>{role.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Users;
