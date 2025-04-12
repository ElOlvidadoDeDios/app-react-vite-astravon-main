import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaEdit, FaEllipsisV, FaTrash } from "react-icons/fa";
import {
  FaRegThumbsUp,
  FaRegComment,
  FaRegShareSquare,
  FaThumbsUp,
} from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import { formatDistanceToNow, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { PostDto } from "../../types/Post";
import { deletePost } from "../../services/Post/Post";
import { ConfirmDeleteModal } from "../../components/ui/ConfirmDeleteModal";
import { toast } from "react-toastify";
import { User } from "../../types/User";
import { createLike, deleteLike } from "../../services/Like/Like";

interface PostProps {
  post: PostDto;
}

export function Post({ post }: PostProps) {
  console.log(post);
  const [user, setUser] = useState<User | null>(null);

  // ---------------------------------------------------------------- USER
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const [likes, setLikes] = useState(post.likeCount);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  // ---------------------------------------------------------------- POST DELETE LIKE
  const handleLike = async () => {
    if (user) {
      const userId: number = user?.id ?? 0;
      try {
        if (liked) {
          await deleteLike(post.id);
          setLikes((prev) => prev - 1);
        } else {
          await createLike(post.id, userId);
          setLikes((prev) => prev + 1);
        }
        setLiked(!liked);
      } catch (error) {
        toast.error("Error al procesar el like.");
      }
    } else {
      toast.error("Debes iniciar sesión para dar like.");
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, newComment]);
      setNewComment("");
    }
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts[1] : "";
    return `${firstName[0].toUpperCase()}${
      lastName ? lastName[0].toUpperCase() : ""
    }`;
  };

  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setShowConfirm(true);
  };

  // ---------------------------------------------------------------- DELETE POST
  const confirmDelete = async () => {
    try {
      const response = await deletePost(post.id);
      if (response.success) {
        toast.success(response.message);
        setShowConfirm(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Oppss, algo salió mal.");
    }
  };

  return (
    <div className="post bg-brown-light text-white p-3 rounded mb-3">
      <div className="d-flex align-items-center mb-2  justify-content-between">
        <div className="d-flex align-items-center">
          <div
            className="user-avatar bg-ter text-white rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: 40, height: 40 }}
          >
            {getInitials(post.userName)}
          </div>
          <div className="ms-2">
            <strong>{post.userName}</strong>
            <small className="d-block text-muted">
              {formatDistanceToNow(parseISO(post.publicationDate), {
                addSuffix: true,
                locale: es,
              })}
            </small>
          </div>
        </div>

        {post.userId === user?.id && (
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              className="text-white p-0"
              style={{ boxShadow: "none", border: "none" }}
            >
              <FaEllipsisV />
            </Dropdown.Toggle>

            <Dropdown.Menu
              align="start"
              style={{
                backgroundColor: "#232321",
                border: "1px solid #333",
              }}
            >
              <Dropdown.Item
                className="d-flex align-items-center text-white"
                style={{
                  color: "#ddd",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "#333")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent")
                }
              >
                <FaEdit className="me-2" />
                Actualizar publicación
              </Dropdown.Item>
              <Dropdown.Item
                className="d-flex align-items-center text-white"
                style={{
                  color: "#ddd",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "#333")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent")
                }
                onClick={handleDelete}
              >
                <FaTrash className="me-2" />
                Eliminar publicación
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>

      {post.content && <p>{post.content}</p>}

      {post.urlMedia && (
        <>
          {post.urlMedia.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
            <img
              src={post.urlMedia}
              alt="Publicación"
              className="media-content img-fluid d-block mx-auto"
              style={{ maxHeight: "350px", objectFit: "contain" }}
              onClick={() => setShowMediaModal(true)}
            />
          ) : post.urlMedia.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              className="media-content w-100 d-block mx-auto"
              style={{ maxHeight: "350px", objectFit: "contain" }}
              controls
              onClick={() => setShowMediaModal(true)}
            >
              <source src={post.urlMedia} type="video/mp4" />
              Tu navegador no soporta el video.
            </video>
          ) : post.urlMedia.match(/\.(pdf)$/i) ? (
            <a
              href={post.urlMedia}
              target="_blank"
              rel="noopener noreferrer"
              className="d-block text-white text-center"
            >
              📄 Ver documento PDF
            </a>
          ) : (
            <p className="text-muted">Formato de archivo no compatible.</p>
          )}
        </>
      )}

      <div className="d-flex justify-content-between text-muted mb-2">
        <span> {likes || post.likeCount} Me gusta</span>
        <span
          style={{ cursor: "pointer" }}
          onClick={() => setShowCommentsModal(true)}
        >
          {comments.length || post.commentCount} Comentarios
        </span>
      </div>

      <div className="d-flex justify-content-around text-muted">
        <button
          className="btn text-white border-0 outline-none"
          onClick={handleLike}
          disabled={!user} // Deshabilita el botón si no hay usuario
        >
          {liked ? (
            <FaThumbsUp style={{ color: "#E4823B" }} />
          ) : (
            <FaRegThumbsUp />
          )}
          <span style={{ color: liked ? "#E4823B" : "inherit" }}>
            {" "}
            Me gusta
          </span>
        </button>
        <button
          className="btn text-white"
          onClick={() => setShowCommentsModal(true)}
        >
          <FaRegComment /> Comentar
        </button>
        <button className="btn text-white">
          <FaRegShareSquare /> Compartir
        </button>
      </div>

      <Modal
        show={showMediaModal}
        onHide={() => setShowMediaModal(false)}
        centered
      >
        <Modal.Body className="p-0">
          {post.urlMedia && (
            <>
              {post.urlMedia.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                <img
                  src={post.urlMedia}
                  alt="Publicación"
                  className="w-100 rounded mb-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowMediaModal(true)}
                />
              ) : post.urlMedia.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  className="w-100 rounded mb-2"
                  controls
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowMediaModal(true)}
                >
                  <source src={post.urlMedia} type="video/mp4" />
                  Tu navegador no soporta el video.
                </video>
              ) : post.urlMedia.match(/\.(pdf)$/i) ? (
                <a
                  href={post.urlMedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-block text-white"
                >
                  📄 Ver documento PDF
                </a>
              ) : (
                <p className="text-muted">Formato de archivo no compatible.</p>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={showCommentsModal}
        onHide={() => setShowCommentsModal(false)}
        centered
      >
        <Modal.Header
          closeButton
          className="bg-brown-light text-white border-1"
        >
          <Modal.Title className="text-center w-100 text-white">
            Comentarios
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-brown-light text-white">
          {post.content && <p className="text-muted">{post.content}</p>}
          {post.urlMedia && (
            <>
              {post.urlMedia.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                <img
                  src={post.urlMedia}
                  alt="Publicación"
                  className="w-100 rounded mb-2"
                  style={{
                    cursor: "pointer",
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "contain",
                  }}
                  onClick={() => setShowMediaModal(true)}
                />
              ) : post.urlMedia.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  className="w-100 rounded mb-2"
                  controls
                  style={{
                    cursor: "pointer",
                    maxWidth: "100%", // Asegura que el video no exceda el tamaño del contenedor
                    maxHeight: "300px", // Limita la altura máxima
                    objectFit: "contain", // Mantiene la relación de aspecto del video
                  }}
                  onClick={() => setShowMediaModal(true)}
                >
                  <source src={post.urlMedia} type="video/mp4" />
                  Tu navegador no soporta el video.
                </video>
              ) : post.urlMedia.match(/\.(pdf)$/i) ? (
                <a
                  href={post.urlMedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="d-block text-white"
                >
                  📄 Ver documento PDF
                </a>
              ) : (
                <p className="text-muted">Formato de archivo no compatible.</p>
              )}
            </>
          )}

          <div
            className="comments-list mb-3 mt-4 comment-scroll"
            style={{ maxHeight: "130px", overflowY: "auto" }}
          >
            {comments.length === 0 ? (
              <p className="text-muted">
                No hay comentarios aún. Sé el primero en comentar.
              </p>
            ) : (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="d-flex align-items-start mb-3"
                  style={{ maxWidth: "70%" }}
                >
                  <img
                    src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                    alt="Perfil"
                    className="rounded-circle me-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    className="p-2 rounded"
                    style={{
                      backgroundColor: "#2E2D2D",
                      color: "white",
                      borderRadius: "10px",
                    }}
                  >
                    <strong className="d-block" style={{ fontSize: "0.9rem" }}>
                      {comment}
                    </strong>
                    <span
                      className="text-white"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Usuario {post.userId}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <Form.Control
            type="text"
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Modal.Body>

        <Modal.Footer className="bg-brown-light border-1">
          <Button
            variant="secondary"
            onClick={() => setShowCommentsModal(false)}
          >
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleAddComment}>
            Comentar
          </Button>
        </Modal.Footer>
      </Modal>
      <ConfirmDeleteModal
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
