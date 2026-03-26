import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import NotAuthorized from "./pages/NotAuthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import AppLayout from "./components/AppLayout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: < Login />,
    },
    {
        element:(
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
        ),
        children:[
            {
                path: "/admin",
                element: (
                    <RoleRoute allowedRole="admin">
                        <AdminDashboard />
                    </RoleRoute>
                ),
            },
             {
                path: "/user",
                element: (
                <RoleRoute allowedRole="user">
                    <UserDashboard />
                </RoleRoute>
                ),
            },
        ]
    },
    {
    path: "/not-authorized",
    element: <NotAuthorized />,
  },
]);