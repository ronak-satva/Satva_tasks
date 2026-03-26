import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from 'antd';

const { Title, Text } = Typography;

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("admin123");

    const handleLogin = async (values) => {
        setLoading(true);
        
        const result = await dispatch(login({ email: values.email, password: values.password }));
        
        if (login.fulfilled.match(result)) {
            message.success('Login successful!');
            navigate("/dashboard");
        } else {
            message.error('Invalid email or password');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center
               bg-gradient-to-br from-indigo-500 to-purple-600">
            <Card className="w-[400px] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                <div  className="text-center mb-8">
                    <Title level={2} className="!mb-2 !text-gray-800">Welcome Back</Title>
                    <Text type="secondary">Sign in to your account</Text>
                </div>
                
                <Form
                    layout="vertical"
                    onFinish={handleLogin}
                    initialValues={{ email: 'admin@gmail.com', password: 'admin123' }}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please enter your email' }]}
                    >
                        <Input 
                            size="large" 
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Item>
                    
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password 
                            size="large" 
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>
                    
                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            loading={loading}
                            block
                            size="large"
                            style={{ marginTop: '8px' }}
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                <div className="mt-6 p-4 bg-sky-50 rounded-lg text-center">
                    <Text strong>Demo Credentials:</Text><br/>
                    <Text>Email: admin@gmail.com</Text><br/>
                    <Text>Password: admin123</Text>
                </div>
            </Card>
        </div>
    );
};

export default Login;
