import axios from "axios";
import { ApiResponse } from "../../types/Response/Response";
import { AuthLogin } from "../../types/Auth";
import { User } from "../../types/User";

//---------------------------------------------------------------- LOGIN
export const login = async (loginData: AuthLogin): Promise<ApiResponse<User>> => {
  try {
    const response = await axios.post<ApiResponse<User>>(
      `${import.meta.env.VITE_API_URL}/User/Login`,
      loginData
    );
    return response.data;
  } catch (error) {
    throw new Error("Error al iniciar sesión");
  }
};

