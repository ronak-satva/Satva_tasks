import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { checkAuthStatus, refreshUserPermissions } from "./features/auth/authSlice";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Employees from "./pages/Employees";
import Roles from "./pages/Roles";
import Permissions from "./pages/Permissions";
import Projects from "./pages/Projects";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import { Spin } from "antd";

function App()
{
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  // Initial loading - wait for store to hydrate from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Periodically refresh permissions from DB to sync across tabs
  useEffect(() => {
    if (user) {
      // Refresh permissions every 10 seconds to sync across tabs
      const refreshInterval = setInterval(() => {
        dispatch(refreshUserPermissions(user));
      }, 10000);

      return () => clearInterval(refreshInterval);
    }
  }, [user, dispatch]);

  // Listen for storage changes (e.g., when localStorage is manually cleared in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if ((e.key === 'isAuthenticated' && e.newValue === null) || 
          (e.key === 'token' && e.newValue === null)) {
        // User manually cleared localStorage, dispatch logout
        dispatch(checkAuthStatus());
      }
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically in case the user clears localStorage in the same window
    const intervalId = setInterval(() => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const token = localStorage.getItem('token');
      if ((!isAuthenticated || !token) && user) {
        dispatch(checkAuthStatus());
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [dispatch, user]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Spin size="large" />
      </div>
    );
  }
  
  return(
    <BrowserRouter>
      {user && <Sidebar />}
      <Routes>
         <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" /> : <Login />} 
         />
         <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute module="users" action="view">
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute module="employees" action="view">
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute module="projects" action="view">
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <ProtectedRoute>
                <Roles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/permissions"
            element={
              <ProtectedRoute>
                <Permissions />
              </ProtectedRoute>
            }
          />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
