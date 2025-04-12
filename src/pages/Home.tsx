import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

import { CreatePostBox } from "./components/CreatePostBox";
import { Post } from "./components/Post";
import { ChatSidebar } from "../layouts/components/ChatSidebar";
import { HUB_URL } from "../services/Post/Post";
import { usePostContext } from "../hooks/PostContext";
import { Loader } from "../components/ui/Loader";

export function HomePage(): JSX.Element {
  const { posts, fetchAllPosts } = usePostContext();
  const [isAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .catch((err: Error) => console.error("Error en SignalR:", err));

    connection.on("RefreshPosts", async () => {
      console.log("📩 Recibiendo actualización...");
      await fetchAllPosts();
    });

    return () => {
      connection
        .stop()
        .catch((err: Error) =>
          console.error("Error al desconectar SignalR:", err)
        );
    };
  }, [fetchAllPosts]);

  return (
    <>
      <ChatSidebar />
      <div className="page-content-post">
        <h6 className="mb-0 text-uppercase text-white">Todos los foros</h6>
        <hr />
        {isAuthenticated && <CreatePostBox />}
        <div className="mb-4"></div>
        {posts.length === 0 ? (
          <Loader />
        ) : (
          posts.map((post) => <Post key={post.id} post={post} />)
        )}
      </div>
    </>
  );
}
