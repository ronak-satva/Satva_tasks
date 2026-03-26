import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  createProject,
  removeProject,
  editProject,
} from "../features/projects/projectSlice";
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  Typography,
  Input,
  Select,
  Form,
  Drawer,
  message,
} from "antd";
import PermissionGate from "../components/PermissionGate";
import { hasPermission } from "../utils/permissionUtils";

const { Title } = Typography;
const { Option } = Select;

const Projects = () => {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.list);
  const { permissions } = useSelector((state) => state.auth);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    if (hasPermission(permissions, "projects", "view")) {
      dispatch(fetchProjects());
    }
  }, [dispatch, permissions]);

  const handleAddProject = (values) => {
    if (!hasPermission(permissions, "projects", "add")) return;

    dispatch(createProject(values)).then(() => {
      message.success("Project added successfully!");
      setDrawerVisible(false);
      form.resetFields();
      dispatch(fetchProjects());
    });
  };

  const handleDelete = (id) => {
    if (!hasPermission(permissions, "projects", "delete")) return;

    dispatch(removeProject(id)).then(() => {
      message.success('Project deleted successfully!');
      dispatch(fetchProjects());
    });
  };

  const handleEdit = (record) => {
    if (!hasPermission(permissions, "projects", "edit")) return;
    
    setSelectedProject(record);
    editForm.setFieldsValue({
      id: record.id,
      name: record.name,
      description: record.description,
      status: record.status
    });
    setEditDrawerVisible(true);
  };

  const onEditFinish = (values) => {
    dispatch(editProject({
      id: selectedProject.id,
      data: values
    })).then(() => {
      message.success('Project updated successfully!');
      setEditDrawerVisible(false);
      setSelectedProject(null);
      editForm.resetFields();
      dispatch(fetchProjects());
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "black";
        if (status === "Active") color = "green";
        else if (status === "Completed") color = "blue";
        else if (status === "Pending") color = "orange";
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <PermissionGate module="projects" action="edit">
            <Button
              type="link"
              onClick={() => handleEdit(record)}
              style={{ color: '#faad14' }}
            >
              Edit
            </Button>
          </PermissionGate>
          <PermissionGate module="projects" action="delete">
            <Button
              type="link"
              danger
              onClick={() => handleDelete(record.id)}
            >
              Delete
            </Button>
          </PermissionGate>
        </>
      ),
    },
  ];

  return (
    <div style={{ marginLeft: "260px", padding: "30px", minHeight: "100vh", background: "#f5f7fa" }}>
      <Card style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Title level={2} style={{ margin: 0, color: "#1e3a5f" }}>
            Projects
          </Title>
          <PermissionGate module="projects" action="add">
            <Button type="primary" onClick={() => setDrawerVisible(true)}>
              Add Project
            </Button>
          </PermissionGate>
        </div>

        <Table
          dataSource={projects}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No projects found. Add a project to get started." }}
        />
      </Card>

      <Drawer
        title="Add New Project"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleAddProject}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter project name" }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            initialValue="Active"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Pending">Pending</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="Edit Project"
        placement="right"
        onClose={() => setEditDrawerVisible(false)}
        open={editDrawerVisible}
        width={400}
      >
        <Form form={editForm} layout="vertical" onFinish={onEditFinish}>
          <Form.Item label="ID" name="id">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter project name" }]}
          >
            <Input placeholder="Enter project name" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Pending">Pending</Option>
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

export default Projects;
