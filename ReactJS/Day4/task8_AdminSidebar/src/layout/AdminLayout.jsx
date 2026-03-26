import { Layout, Menu, Button } from "antd";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../features/ui/uiSlice";

const { Sider, Content, Header } = Layout;

const AdminLayout = () => {
  const collapsed = useSelector((state) => state.ui.collapsed);
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} >
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={[
            {
              key: "/dashboard",
              label: <Link to="/dashboard">Dashboard</Link>,
            },
            {
              key: "/settings",
              label: <Link to="/settings">Settings</Link>,
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header>
          <Button onClick={() => dispatch(toggleSidebar())}>
            Toggle Sidebar
          </Button>
        </Header>

        <Content style={{ padding: 20 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;