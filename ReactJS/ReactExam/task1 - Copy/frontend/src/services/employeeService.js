import axios from "axios";

const API = "http://localhost:5000/employees";

export const getEmployees = async () => {
    const res = await axios.get(API);
    return res.data;
};

export const addEmployee = async (data) => {
    const res = await axios.post(API, data);
    return res.data;
}

export const updateEmployee = async (id, data) => {
    const res = await axios.patch(`${API}/${id}`, data);
    return res.data;
};

export const deleteEmployee = async (id) => {
    await axios.delete(`${API}/${id}`);
    return id;
};

//All employee API logic stays here.
//Frontend never directly uses axios.