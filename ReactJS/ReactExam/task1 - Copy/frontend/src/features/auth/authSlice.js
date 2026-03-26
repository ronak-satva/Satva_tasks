import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../services/authService";
import axios from "axios";

const API = "http://localhost:5000";

// Load auth state from localStorage
const loadAuthFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('role');
    const permissions = localStorage.getItem('permissions');
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('token');

    if (user && role && permissions && isAuthenticated === 'true') {
      return {
        user: JSON.parse(user),
        role: JSON.parse(role),
        permissions: JSON.parse(permissions),
        isAuthenticated: true,
        token
      };
    }
  } catch (error) {
    console.error('Error loading auth from localStorage:', error);
  }
  return {
    user: null,
    role: null,
    permissions: null,
    isAuthenticated: false,
    token: null
  };
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    return await loginUser(email, password);
  }
);

// Fetch fresh role and permissions from backend
export const refreshUserPermissions = createAsyncThunk(
  "auth/refreshPermissions",
  async (user, { rejectWithValue }) => {
    try {
      if (!user || !user.roleId) {
        return rejectWithValue("User or role ID not found");
      }
      const roleRes = await axios.get(`${API}/roles/${user.roleId}`);
      return roleRes.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthFromStorage(),
  reducers: {
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.permissions = null;
      state.isAuthenticated = false;
      state.token = null;
      // Clear localStorage on logout
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('permissions');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
    },
    // Action to check if localStorage was cleared externally
    checkAuthStatus: (state) => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const token = localStorage.getItem('token');
      if (!isAuthenticated || !token) {
        state.user = null;
        state.role = null;
        state.permissions = null;
        state.isAuthenticated = false;
        state.token = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.permissions = action.payload.role.permissions;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      
      // Save to localStorage on successful login
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('role', JSON.stringify(action.payload.role));
      localStorage.setItem('permissions', JSON.stringify(action.payload.role.permissions));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('token', action.payload.token);
    })
    .addCase(refreshUserPermissions.fulfilled, (state, action) => {
      state.role = action.payload;
      state.permissions = action.payload.permissions;
      // Update localStorage with fresh permissions
      localStorage.setItem('role', JSON.stringify(action.payload));
      localStorage.setItem('permissions', JSON.stringify(action.payload.permissions));
    });
  }
});
export const { logout, checkAuthStatus } = authSlice.actions;
export default authSlice.reducer;
