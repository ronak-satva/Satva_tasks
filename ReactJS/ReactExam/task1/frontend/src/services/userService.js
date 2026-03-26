import axios from "axios";

const API = "http://localhost:5000/users";

export const getUsers = async () => {
    const res = await axios.get(API);
    return res.data;
};

export const addUser = async (data) => {
    const res = await axios.post(API, data);
    return res.data;
};

export const updateUser = async (id, data) => {
    const res = await axios.patch(`${API}/${id}`, data);
    return res.data;
};

export const deleteUser = async (id) => {
    await axios.delete(`${API}/${id}`);
    return id;
};

//All user API logic stays here.
//Frontend never directly uses axios.
