import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {getEmployees,addEmployee,updateEmployee,deleteEmployee,} from "../../services/employeeService";

export const fetchEmployees = createAsyncThunk(
    "employees/fetch",
    async() => {
        return await getEmployees();
    }
);

export const createEmployee = createAsyncThunk(           // MAnages employees in redux
    "employees/create",
    async (data) => {
        return await addEmployee(data);
    }
);

export const editEmployee = createAsyncThunk(
    "employees/edit",
    async ({id, data}) => {
        return await updateEmployee(id, data);
    }
);

export const  removeEmployee = createAsyncThunk(
  "employees/delete",
  async (id) => {
    await deleteEmployee(id);
    return id;
  }
);

const employeeSlice = createSlice({
    name: "employees",
    initialState: {
    list: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      }).addCase(editEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (emp) => emp.id === action.payload.id
        );
         state.list[index] = action.payload;
         })
         .addCase(removeEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (emp) => emp.id !== action.payload
        );
      });
  },
});
export default employeeSlice.reducer;
