import axios from "axios";

const API = "http://localhost:5000/projects";

export const getProjects = async () => {
    const res = await axios.get(API);
    return res.data;
};

export const addProject = async (data) => {
    const res = await axios.post(API, data);
    return res.data;
}

export const updateProject = async (id, data) => {
    const res = await axios.patch(`${API}/${id}`, data);
    return res.data;
};

export const deleteProject = async (id) => {
    await axios.delete(`${API}/${id}`);
    return id;
};
