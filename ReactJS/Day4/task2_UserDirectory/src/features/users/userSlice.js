import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users : [
        { id: 1, name: "Ronak", email: "ronak@gmail.com", role: "Admin" },
        { id: 2, name: "Amit", email: "amit@gmail.com", role: "User" },
        { id: 3, name: "Neha", email: "neha@gmail.com", role: "Manager" },
        { id: 4, name: "Riya", email: "riya@gmail.com", role: "User" },
        { id: 5, name: "Karan", email: "karan@gmail.com", role: "User" }
    ]
};

const userSlice = createSlice({
    name : "users",
    initialState,
    reducers: {
        deleteUser: (state,action) => {
            state.users = state.users.filter(
            user => user.id !== action.payload
            );
        }
    }
})

export const { deleteUser } = userSlice.actions;
export default userSlice.reducer;