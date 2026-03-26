import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/users/userSlice";
import employeeReducer from "../features/employees/employeeSlice";
import roleReducer from "../features/roles/roleSlice";
import projectReducer from "../features/projects/projectSlice";

// Create a function to load initial state
const loadInitialState = () => {
  try {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    const permissions = localStorage.getItem('permissions');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('token');

    if (user && role && permissions && isAuthenticated === 'true') {
      return {
        auth: {
          user: JSON.parse(user),
          role: JSON.parse(role),
          permissions: JSON.parse(permissions),
          isAuthenticated: true,
          token
        }
      };
    }
  } catch (error) {
    console.error('Error loading auth from localStorage:', error);
  }
  return undefined;
};

const initialState = loadInitialState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    employees: employeeReducer,
    roles: roleReducer,
    projects: projectReducer,
  },
  preloadedState: initialState,
});
