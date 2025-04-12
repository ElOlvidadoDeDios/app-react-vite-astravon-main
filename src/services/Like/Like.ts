import { ApiResponse } from "../../types/Response/Response";

// ---------------------------------------------------------------- POS LIKE
export const createLike = async (
  postId: number,
  userId: number
): Promise<ApiResponse<null>> => {
  try {
    const requestBody = {
      userId: userId,
      postId: postId,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/Posts/createLike`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error("Error al agregar el like");
    }
    const result: ApiResponse<null> = await response.json();

    return result;
  } catch (error) {
    return {
      success: false,
      message: "Error de conexión con el servidor",
      data: null,
    };
  }
};

// ---------------------------------------------------------------- DELETE LIKE
export const deleteLike = async (
  likeId: number
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/Posts/deleteLike/${likeId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar el like");
    }

    const result: ApiResponse<null> = await response.json();

    return result;
  } catch (error) {
    return {
      success: false,
      message: "Error de conexión con el servidor",
      data: null,
    };
  }
};
