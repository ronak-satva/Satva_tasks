import axios from "axios";

const API = "http://localhost:5000";

// Generate a simple JWT-like token (base64 encoded)
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    roleId: user.roleId,
    timestamp: Date.now()
  };
  // Create a simple base64 encoded token (not a real JWT, but serves the purpose)
  return btoa(JSON.stringify(payload));
};

export const loginUser = async (email, password) => {
    const res =await axios.get(`${API}/users?email=${email}&password=${password}`);

    const user = res.data[0];

    if (!user || user.password != password){
      throw new Error("Invalid credentials");
    }

    const roleRes = await axios.get(`${API}/roles/${user.roleId}`);
    
    // Generate token on successful login
    const token = generateToken(user);
    
    return {
    user,
    role: roleRes.data,
    token
  };
}
