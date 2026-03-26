import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, editRole, deleteRole } from "../features/roles/roleSlice";
import { Table, Button, Card, Typography, Tag, Space, Drawer, Form, Input, message } from 'antd';

const { Title } = Typography;

const Roles = () => {
  const dispatch = useDispatch();
  const { roles } = useSelector((state) => state.roles);
  const [loading, setLoading] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    dispatch(fetchRoles()).finally(() => setLoading(false));
  }, [dispatch]);

  const handleEdit = (record) => {
    setSelectedRole(record);
    editForm.setFieldsValue({
      id: record.id,
      name: record.name,
    });
    setEditDrawerVisible(true);
  };

  const handleDelete = (id) => {
    dispatch(deleteRole(id)).then(() => {
      message.success('Role deleted successfully!');
      dispatch(fetchRoles());
    });
  };

  const onEditFinish = (values) => {
    dispatch(editRole({
      id: selectedRole.id,
      data: {
        ...values,
        permissions: selectedRole.permissions
      }
    })).then(() => {
      message.success('Role updated successfully!');
      setEditDrawerVisible(false);
      setSelectedRole(null);
      editForm.resetFields();
      dispatch(fetchRoles());
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
      title: 'Permissions',
      key: 'permissions',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.permissions && Object.entries(record.permissions).map(([module, perms]) => (
            <div key={module}>
              <Tag color="blue" style={{ marginBottom: '4px' }}>{module}</Tag>
              {perms.map((perm) => (
                <Tag key={perm} color="green">{perm}</Tag>
              ))}
            </div>
          ))}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            onClick={() => handleEdit(record)}
            style={{ color: '#faad14' }}
          >
            Edit
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ marginLeft: '260px', padding: '30px', minHeight: '100vh', background: '#f5f7fa' }}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0, color: '#1e3a5f' }}>Roles</Title>
          <Button type="primary" onClick={() => setDrawerVisible(true)}>Add Role</Button>
        </div>
        
        <Table 
          dataSource={roles} 
          columns={columns} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Drawer
        title="Add New Role"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="Edit Role"
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
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please enter role name' }]}
          >
            <Input placeholder="Enter role name" />
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

export default Roles;
