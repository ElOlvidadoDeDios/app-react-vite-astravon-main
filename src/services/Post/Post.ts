import { GetPost } from "../../types/Post";
import { ApiResponse } from "../../types/Response/Response";

export const HUB_URL = "https://astravon-bk-production.up.railway.app/postHub";

//---------------------------------------------------------------- POST GETALL
export const fetchPosts = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/Posts/getAllPostWithCounts`,);
    if (!response.ok) throw new Error("Error al cargar posts");

    const data = await response.json();
    if (!Array.isArray(data.data)) {
      return [];
    }

    return data.data;
  } catch (error) {
    return [];
  }
};

//---------------------------------------------------------------- POST CREATE
export const createPost = async (
  userId: number,
  content: string,
  postUrl: string,
  mediaFile: File | null
): Promise<ApiResponse<null>> => {
  try {
    const formData = new FormData();
    formData.append("UserId", userId.toString());
    formData.append("Content", content);
    formData.append("PostUrl", postUrl);

    if (mediaFile) {
      formData.append("MediaFile", mediaFile);
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/Posts/createPost`,
      {
        method: "POST",
        body: formData,
      }
    );

    const result: ApiResponse<null> = await response.json();
    return result;
  } catch {
    return { success: false, message: "Error de conexión con el servidor", data: null };
  }
};

//---------------------------------------------------------------- GET POST
export const fetchPostById = async (idPost: number): Promise<ApiResponse<GetPost | null>> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/Posts/getPostById/${idPost}`);
    if (!response.ok) throw new Error("Error al cargar el post");

    const data: ApiResponse<GetPost> = await response.json();
    if (!data.success || !data.data) {
      return { success: false, message: "Post no encontrado", data: null };
    }

    return data;
  } catch (error) {
    return { success: false, message: "Error de conexión con el servidor", data: null };
  }
};

//---------------------------------------------------------------- UPDATE POST
export const updatePost = async (
  id: number,
  content: string,
  postUrl: string,
  mediaFile: File | null
): Promise<ApiResponse<null>> => {
  try {
    const formData = new FormData();
    formData.append("Id", id.toString());  
    formData.append("Content", content);
    formData.append("PostUrl", postUrl);

    if (mediaFile) {
      formData.append("MediaFile", mediaFile);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/Posts/updatePost`, {
      method: "PUT", 
      body: formData,
    });

    const result: ApiResponse<null> = await response.json();
    return result;
  } catch (error) {
    return { success: false, message: "Error de conexión con el servidor", data: null };
  }
};


//---------------------------------------------------------------- POST DELETE
export const deletePost = async (idPost: number): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/Posts/deletePost/${idPost}`,
      { method: "DELETE" }
    );

    const result: ApiResponse<null> = await response.json();
    return result;
  } catch {
    return { success: false, message: "Error de conexión con el servidor", data: null };
  }
};
