import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/roles";

export const fetchRoles = createAsyncThunk("roles/fetch", async () => {
  const res = await axios.get(API);
  return res.data;
});

export const editRole = createAsyncThunk(
  "roles/edit",
  async ({ id, data }) => {
    const res = await axios.patch(`${API}/${id}`, data);
    return res.data;
  }
);

export const deleteRole = createAsyncThunk(
  "roles/delete",
  async (id) => {
    await axios.delete(`${API}/${id}`);
    return id;
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(editRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex(role => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter(role => role.id !== action.payload);
      });
  },
});

export default roleSlice.reducer;
