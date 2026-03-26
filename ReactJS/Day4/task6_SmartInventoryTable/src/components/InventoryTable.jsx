import { useSelector, useDispatch } from "react-redux";
import { Table, Button, message } from "antd";
import { deleteProduct } from "../features/inventory/inventorySlice";

function InventoryTable() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.inventory.products);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    message.success("Product Deleted Successfully");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record.id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      pagination={false}
    />
  );
}

export default InventoryTable;