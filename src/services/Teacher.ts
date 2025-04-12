import { Teacher } from "../types/Teacher";
import { ApiResponse } from "../types/Response/Response";

//---------------------------------------------------------------- GET ALL TEACHER
export const getAllTeacher = async (): Promise<Teacher[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/Teacher/GetAll`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener los eventos");
    }

    const data: ApiResponse<Teacher[]> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    throw error;
  }
};

//---------------------------------------------------------------- POST TEACHER
export const createTeacher = async (data: {
  firstName: string;
  lastName: string;
  dni: string;
  mail: string;
  phone: string;
  gender: boolean;
  birthDate:string
}): Promise<ApiResponse<Teacher>> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/Teacher/CreateTeacher`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error al crear el docente");
    }

    const dataResponse: ApiResponse<Teacher> = await response.json();
    return dataResponse;
  } catch (error: any) {
    throw new Error(error);
  }
};

//---------------------------------------------------------------- UPDATE TEACHER
export const actualizarTeacher = async (
  teacher: Partial<Teacher>
): Promise<ApiResponse<Teacher>> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/Teacher/UpdateTeacher`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacher),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el docente");
    }
    const responseData: ApiResponse<Teacher> = await response.json();
    return responseData;
  } catch (error) {
    throw new Error("Error al actualizar el docente: " + error);
  }
};

//---------------------------------------------------------------- DELETE TEACHER
export const eliminarTeacher = async (
  teacherId: number
): Promise<ApiResponse<null>> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/Teacher/DeleteTeacher/${teacherId}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el docente");
    }
    const responseData: ApiResponse<null> = await response.json();
    return responseData;
  } catch (error) {
    throw new Error("Error al eliminar el docente: " + error);
  }
};
