import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaVideo, FaPhotoVideo, FaComment, FaFileAlt } from "react-icons/fa";
import { User } from "../../types/User";
import { toast } from "react-toastify";
import { createPost } from "../../services/Post/Post";

export function CreatePostBox() {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // ---------------------------------------------------------------- GET USER
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const userId: number = user?.id ?? 0;

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setContent("");
    setPreview(null);
    setFile(null);
    setFileType(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
      setFileType(selectedFile.type.startsWith("video") ? "video" : "image");
      setFile(selectedFile);
    }
  };

  // ---------------------------------------------------------------- POST
  const handleSubmit = async () => {
    try {
      if (!user) return;

      const response = await createPost(userId, content, "NADA", file);

      if (response.success) {
        toast.success(response.message);
        handleClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Oops, algo salió mal");
    }
  };

  return (
    <div className="create-post-box bg-brown-light p-3 text-white">
      <div className="d-flex align-items-center">
        <img
          src="../../assets/images/user.png"
          alt="User Profile"
          className="rounded-circle me-2"
          style={{ width: "40px", height: "40px" }}
        />
        <input
          type="text"
          readOnly
          className="form-control text-white"
          style={{ backgroundColor: "#5A5A59", cursor: "pointer" }}
          placeholder={`¿Qué estás pensando, ${
            user?.firstName?.split(" ")[0] ?? "Usuario"
          }?`}
          onClick={handleShow}
        />
      </div>
      <hr className="text-white" />
      <div className="d-flex justify-content-around">
        <button className="btn text-white" onClick={handleShow}>
          <FaVideo className="text-danger me-1" /> Videos
        </button>
        <button className="btn text-white" onClick={handleShow}>
          <FaPhotoVideo className="text-success me-1" /> Fotos
        </button>
        <button className="btn text-white" onClick={handleShow}>
          <FaComment className="text-primary me-1" /> Comenta
        </button>
        <button className="btn text-white" onClick={handleShow}>
          <FaFileAlt className="text-warning me-1" /> Documentos
        </button>
      </div>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          className="bg-brown-light text-white border-1"
        >
          <Modal.Title className="text-center w-100 text-white">
            Crear publicación
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="bg-brown-light text-white">
          <div className="d-flex align-items-center mb-3">
            <img
              src="../../assets/images/user.png"
              alt="User Profile"
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px" }}
            />
            <span>
              {user?.firstName} {user?.lastName}
            </span>
          </div>
          <textarea
            className="form-control bg-brown-light2 text-white mb-3"
            placeholder="¿Qué estás pensando?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div
            className="bg-brown-light2 rounded d-flex flex-column justify-content-center align-items-center p-3"
            style={{ height: "150px", cursor: "pointer", position: "relative" }}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            {preview ? (
              <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                {fileType === "video" ? (
                  <video
                    src={preview}
                    className="w-100 h-100 rounded object-fit-cover"
                    controls
                  />
                ) : (
                  <img
                    src={preview}
                    className="w-100 h-100 rounded object-fit-cover"
                    alt="Preview"
                  />
                )}
              </div>
            ) : (
              <>
                <FaPhotoVideo size={40} className="text-white mb-2" />
                <span className="text-white fw-bold">
                  Agregar fotos/videos/Docs
                </span>
              </>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*, video/*"
              className="d-none"
              onChange={handleFileChange}
            />
          </div>
        </Modal.Body>

        <Modal.Footer className="bg-brown-light border-1">
          <Button
            className="w-100 fw-bold"
            disabled={!(content || file)}
            onClick={handleSubmit}
          >
            Publicar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
