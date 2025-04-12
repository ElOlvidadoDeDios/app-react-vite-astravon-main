import { Student } from "../types/Student";
import { ApiResponse } from "../types/Response/Response";

//---------------------------------------------------------------- GET ALL Student
export const getAllStudent = async (): Promise<Student[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/Student/GetAll`,
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

    const data: ApiResponse<Student[]> = await response.json();
    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  } catch (error) {
    throw error;
  }
};

//---------------------------------------------------------------- POST STUDENT
export const createStudent = async (
  data: {
    firstName: string;
    lastName: string;
    dni: string;
    mail: string;
    phone: string;
    gender: boolean;
    code: string;
    birthDate: string;
  }
): Promise<ApiResponse<Student>> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/Student/CreateStudent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Error al crear el estudiante");
    }

    const dataResponse: ApiResponse<Student> = await response.json();
    return dataResponse;
  } catch (error: any) {
    throw new Error(error);
  }
};

//---------------------------------------------------------------- UPDATE STUDENT
export const actualizarStudent = async (
  Student: Partial<Student>
): Promise<ApiResponse<Student>> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/Student/UpdateStudent`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Student),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar el estudiante");
    }
    const responseData: ApiResponse<Student> = await response.json();
    return responseData;
  } catch (error) {
    throw new Error("Error al actualizar el estudiante: " + error);
  }
};

//---------------------------------------------------------------- DELETE STUDENT
export const eliminarStudent = async (
  studentId: number
): Promise<ApiResponse<null>> => {
  try {
    const url = `${import.meta.env.VITE_API_URL}/Student/DeleteStudent/${studentId}`;
    const response = await fetch(url, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el estudiante");
    }
    const responseData: ApiResponse<null> = await response.json();
    return responseData;
  } catch (error) {
    throw new Error("Error al eliminar el estudiante: " + error);
  }
};