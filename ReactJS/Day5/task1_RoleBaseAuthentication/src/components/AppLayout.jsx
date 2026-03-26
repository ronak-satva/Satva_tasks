import { Layout, Menu, Button  } from "antd";
import { useDispatch, useSelector, useEffect } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { Link, Outlet, useNavigate } from "react-router-dom";

const { Header, Content } = Layout;

export default function AppLayout(){
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    useEffect(()=>{
      if(isAuthenticated){
        navigate("/dashboard")
      }
      else{
        navigate("/")
      }
    },[isAuthenticated, navigate])

    const menuItems =
    user?.role === "admin"
      ? [{ key: "admin", label: <Link to="/admin">Admin</Link> }]
      : [{ key: "user", label: <Link to="/user">User</Link> }];

      return (
       <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        
        <Menu theme="dark" mode="horizontal" items={menuItems} />

       
        <div style={{ display: "flex", alignItems: "center", gap: "15px", color: "white" }}>
          <span>
            {user?.name} ({user?.role})
          </span>

          <Button type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Header>

      <Content style={{ padding: "24px" }}>
        <Outlet />
      </Content>
    </Layout>
      );
}