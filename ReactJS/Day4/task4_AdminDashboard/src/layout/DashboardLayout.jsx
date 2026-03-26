import { Layout, Menu, Button } from "antd"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { toggleTheme } from "../features/theme/themeSlice"
import { toggleSidebar } from "../features/layout/layoutSlice"

const { Header, Sider, Content } = Layout

function DashboardLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const collapsed = useSelector(state => state.layout.collapsed)
  const theme = useSelector(state => state.theme.mode)

  return (
    <Layout style={{ minHeight: "100vh" }}>
      
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => dispatch(toggleSidebar())}
        theme={theme}
      >
        <Menu
          theme={theme}
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            { key: "/dashboard", label: "Dashboard" },
            { key: "/users", label: "Users" },
            { key: "/settings", label: "Settings" }
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ background: "#fff", display: "flex", justifyContent: "space-between" }}>
          <h3>Admin Dashboard</h3>
          <Button onClick={() => dispatch(toggleTheme())}>
            Toggle Theme
          </Button>
        </Header>

        <Content style={{ padding: 20 }}>
          <Outlet />
        </Content>
      </Layout>

    </Layout>
  )
}

export default DashboardLayout;