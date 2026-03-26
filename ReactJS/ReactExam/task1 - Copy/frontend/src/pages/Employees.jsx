import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  createEmployee,
  editEmployee,
  removeEmployee,
} from "../features/employees/employeeSlice";
import { Table, Button, Card, Typography, Drawer, Form, Input, message } from 'antd';
import PermissionGate from "../components/PermissionGate";
import { hasPermission } from "../utils/permissionUtils";

const { Title } = Typography;

const Employees = () => {
    const dispatch = useDispatch();
    const employees = useSelector((state) => state.employees.list);
    const { permissions } = useSelector((state) => state.auth);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editDrawerVisible, setEditDrawerVisible] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();

    useEffect(() => {
        if (hasPermission(permissions, "employees", "view")) {
            dispatch(fetchEmployees());
        }
    }, [dispatch, permissions]);

    const handleAdd = (values) => {
        if (!hasPermission(permissions, "employees", "add")) return;

        dispatch(createEmployee({ 
            id: values.id,
            name: values.name,
            designation: values.designation 
        })).then(() => {
            message.success('Employee added successfully!');
            setDrawerVisible(false);
            form.resetFields();
            dispatch(fetchEmployees());
        });
    };

    const handleDelete = (id) => {
        if (!hasPermission(permissions, "employees", "delete")) return;
        dispatch(removeEmployee(id)).then(() => {
            message.success('Employee deleted successfully!');
            dispatch(fetchEmployees());
        });
    };

    const handleEdit = (record) => {
        if (!hasPermission(permissions, "employees", "edit")) return;
        setSelectedEmployee(record);
        editForm.setFieldsValue({
            id: record.id,
            name: record.name,
            designation: record.designation
        });
        setEditDrawerVisible(true);
    };

    const onEditFinish = (values) => {
        dispatch(editEmployee({ 
            id: selectedEmployee.id,
            data: {
                name: values.name,
                designation: values.designation
            }
        })).then(() => {
            message.success('Employee updated successfully!');
            setEditDrawerVisible(false);
            setSelectedEmployee(null);
            editForm.resetFields();
            dispatch(fetchEmployees());
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <PermissionGate module="employees" action="edit">
                        <Button 
                            type="link" 
                            onClick={() => handleEdit(record)}
                            className="!text-yellow-700"
                        >
                            Edit
                        </Button>
                    </PermissionGate>
                    <PermissionGate module="employees" action="delete">
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
        <div className="ml-[260px] p-8 min-h-screen bg-gray-100">
            <Card className="mb-6">
                <div className="flex justify-between items-center mb-6">
                    <Title level={2}  className="!mb-0 !text-blue-900">Employees</Title>
                    <PermissionGate module="employees" action="add">
                        <Button type="primary" onClick={() => setDrawerVisible(true)}>Add Employee</Button>
                    </PermissionGate>
                </div>
                
                <Table 
                    dataSource={employees} 
                    columns={columns} 
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'No employees found. Add an employee to get started.' }}
                />
            </Card>

            <Drawer
                title="Add New Employee"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                width={400}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAdd}
                >
                    <Form.Item
                        label="ID"
                        name="id"
                        rules={[{ required: true, message: 'Please enter employee ID' }]}
                    >
                        <Input type="number" placeholder="Enter employee ID" />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter employee name' }]}
                    >
                        <Input placeholder="Enter employee name" />
                    </Form.Item>

                    <Form.Item
                        label="Designation"
                        name="designation"
                        rules={[{ required: true, message: 'Please enter designation' }]}
                    >
                        <Input placeholder="Enter designation" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Drawer>

            <Drawer
                title="Edit Employee"
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
                        rules={[{ required: true, message: 'Please enter employee name' }]}
                    >
                        <Input placeholder="Enter employee name" />
                    </Form.Item>

                    <Form.Item
                        label="Designation"
                        name="designation"
                        rules={[{ required: true, message: 'Please enter designation' }]}
                    >
                        <Input placeholder="Enter designation" />
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

export default Employees;
