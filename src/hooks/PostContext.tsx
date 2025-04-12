import { createContext, useContext, useState, useEffect } from "react";
import { fetchPosts } from "../services/Post/Post";
import { PostDto } from "../types/Post";

interface PostContextType {
  posts: PostDto[];
  fetchAllPosts: () => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<PostDto[]>([]);

  const fetchAllPosts = async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error al obtener posts:", error);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <PostContext.Provider value={{ posts, fetchAllPosts }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  const context = useContext(PostContext);
  if (!context) throw new Error("usePostContext debe usarse dentro de PostProvider");
  return context;
}
