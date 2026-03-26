// Fetches users from backend

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers, addUser as createUser, updateUser, deleteUser as removeUser } from "../../services/userService";

export const fetchUsers = createAsyncThunk("users/fetch", async () =>{
    return await getUsers();
});

export const addUser = createAsyncThunk("users/add", async (user) => {
    return await createUser(user);
});

export const editUser = createAsyncThunk(
    "users/edit",
    async ({id, data}) => {
        return await updateUser(id, data);
    }
);

export const deleteUser = createAsyncThunk(
    "users/delete",
    async (id) => {
        await removeUser(id);
        return id;
    }
);

const userSlice =  createSlice({
    name : "users",
    initialState : {
        list : [],
    },
    extraReducers : (builder) => {
        builder.addCase(fetchUsers.fulfilled, (state,action) => {
            state.list = action.payload
        });
        builder.addCase(addUser.fulfilled, (state,action) => {
            state.list.push(action.payload)
        });
        builder.addCase(editUser.fulfilled, (state, action) => {
            const index = state.list.findIndex(
                (user) => user.id === action.payload.id
            );
            state.list[index] = action.payload;
        });
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.list = state.list.filter(
                (user) => user.id !== action.payload
            );
        });
    },
});

export default userSlice.reducer;

