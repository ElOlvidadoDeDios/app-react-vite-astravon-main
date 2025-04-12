import { ApiResponse } from "../types/Response/Response";
import { User } from "../types/User";

//---------------------------------------------------------------- VERIFICATE MAIL
export const enviarVerificacionEmail = async (
  email: string
): Promise<ApiResponse<void>> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/User/SendCodeValidation/${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: ApiResponse<void> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API: Error al enviar la verificación de email");
    }

    return data;
  } catch (error) {
    console.error("API: Error al enviar la verificación de email", error);
    throw new Error("Error al enviar la verificación de email");
  }
};

//---------------------------------------------------------------- VERIFICATE CODE
export const verificarCodigo = async (
  Email: string,
  Code: string
): Promise<ApiResponse<void>> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/User/ValidateMail?Email=${encodeURIComponent(
      Email
    )}&Code=${encodeURIComponent(Code)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("API: Error al verificar el código");
    }

    const data: ApiResponse<void> = await response.json();
    return data;
  } catch (error) {
    console.error("API: Error al verificar el código", error);
    throw error;
  }
};

//---------------------------------------------------------------- POST USER
export const createUser = async (
  data: {
    firstName: string;
    lastName: string;
    mail: string;
    password: string;
  }
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/User/createUser`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error al crear el usuario");
    }

    const dataResponse: ApiResponse<User> = await response.json();
    return dataResponse;
  } catch (error: any) {
    throw new Error(error);
  }
};

//---------------------------------------------------------------- UPDATE USER
export const actualizarUser = async (
  User: Partial<User>
): Promise<ApiResponse<User>> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/User/UpdateUser`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(User),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el usuario");
    }
    const responseData: ApiResponse<User> = await response.json();
    return responseData;
  } catch (error) {
    throw new Error("Error al actualizar el usuario: " + error);
  }
};

//---------------------------------------------------------------- DELETE USER
export const eliminarUser = async (
  userId: number
): Promise<ApiResponse<null>> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/User/DeleteUser/${userId}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el usuario");
    }
    const responseData: ApiResponse<null> = await response.json();
    return responseData;
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + error);
  }
};