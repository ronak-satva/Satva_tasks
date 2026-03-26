import { Table, Button, Popconfirm } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { deleteUser } from "./userSlice";

function UserTable() {
  const users = useSelector((state) => state.users.users);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

 const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    filters: [
      { text: "Admin", value: "Admin" },
      { text: "User", value: "User" },
      { text: "Manager", value: "Manager" }
    ],
    onFilter: (value, record) => record.role === value
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Popconfirm
        title="Are you sure?"
        onConfirm={() => handleDelete(record.id)}
      >
        <Button danger>Delete</Button>
      </Popconfirm>
    )
  }
];

  return <Table
  dataSource={users}
  columns={columns}
  rowKey="id"
  pagination={{
    pageSize: 3,
    showSizeChanger: false,
    pageSizeOptions: ["3", "5", "10"],
    showTotal: (total) => `Total ${total} users`
  }}
/>
}

export default UserTable;