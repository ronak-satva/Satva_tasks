import { Card, Form, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

const users = [
  { username: "admin", password: "admin123", role: "admin", name: "Admin" },
  { username: "user", password: "user123", role: "user", name: "User" },
];

export default function Login(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

     const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (isAuthenticated) {
      return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
    }

const onFinish = (values) => {
    const foundUser = users.find(
      (u) =>
        u.username === values.username &&
        u.password === values.password
    );

    if (foundUser){
        dispatch(login(foundUser));
        message.success("Login Successfull");

        if (foundUser.role == "admin"){
            navigate("/admin");
        }
        else{
            navigate("/user");
        }
    }
    else{
        message.error("Invalid credentials");
    }
};

    return(
        <Card title="Login" style={{ width: 300, margin: "100px auto" }}>
      <Form onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true }]}>
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
      </Form>
    </Card>
    );
}