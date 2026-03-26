import { createSlice } from "@reduxjs/toolkit";
const savedUser = JSON.parse(localStorage.getItem("authUser"));

const initialState = {
    user: savedUser || null,
    isAuthenticated: savedUser ? true : false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state,action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem("authUser",JSON.stringify(action.payload));
        },
        logout: (state) => {
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("authUser");
    },
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;