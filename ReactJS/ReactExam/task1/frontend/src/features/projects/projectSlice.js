import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProjects, addProject, deleteProject, updateProject } from "../../services/projectService";

export const fetchProjects = createAsyncThunk("projects/fetch", async () => {
    return await getProjects();
});

export const createProject = createAsyncThunk("projects/create", async (data) => {
    return await addProject(data);
});

export const editProject = createAsyncThunk(
    "projects/edit",
    async ({id, data}) => {
        return await updateProject(id, data);
    }
);

export const removeProject = createAsyncThunk("projects/delete", async (id) => {
    await deleteProject(id);
    return id;
});

const projectSlice = createSlice({
    name: "projects",
    initialState: {
        list: [],
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProjects.fulfilled, (state, action) => {
            state.list = action.payload;
        });
        builder.addCase(createProject.fulfilled, (state, action) => {
            state.list.push(action.payload);
        });
        builder.addCase(editProject.fulfilled, (state, action) => {
            const index = state.list.findIndex(
                (project) => project.id === action.payload.id
            );
            state.list[index] = action.payload;
        });
        builder.addCase(removeProject.fulfilled, (state, action) => {
            state.list = state.list.filter(project => project.id !== action.payload);
        });
    },
});

export default projectSlice.reducer;
