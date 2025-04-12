import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Spinner, Alert } from "react-bootstrap";
import { SectionList } from "./components/SectionList";
import { useNavigate } from "react-router-dom";

interface Section {
  id: number;
  resourceName: string;
  instructions: string;
  externalUrl: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  duration: string;
  level: string;
  moduleId: number;
}

interface Comment {
  id: number;
  name: string;
  text: string;
  avatar: string;
}

const API_BASE_URL = "http://localhost:3001/api";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, sectionsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/courses/${id}`),
          fetch(`${API_BASE_URL}/sections?courseId=${id}`)
        ]);

        if (!courseRes.ok || !sectionsRes.ok) throw new Error("Error al cargar datos");
        
        const [courseData, sectionsData] = await Promise.all([
          courseRes.json(),
          sectionsRes.json()
        ]);

        setCourse(courseData);
        setSections(sectionsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: comments.length + 1,
          name: "Tú",
          text: newComment,
          avatar: "https://i.pravatar.cc/40?img=4",
        },
      ]);
      setNewComment("");
    }
  };

  if (loading) return <Spinner animation="border" variant="light" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!course) return <Alert variant="warning">Curso no encontrado</Alert>;

  return (
    <div className="page-content text-white">
      <div className="row">
        {/* Contenedor del video */}
        <div className="col-md-8 rounded">
          <div className="video-container position-relative">
            <div className="px-2 bg-brown py-2 rounded mb-3 d-flex justify-content-between align-items-center">
              <div>
                <h2 className="text-uppercase">{course.title}</h2>
                <h5 className="text-warning">{course.level}</h5>
              </div>
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={() => navigate(-1)}
              >
                ← Volver
              </button>
            </div>
            
            <div className="bg-brown rounded">
              <video
                ref={videoRef}
                src={course.videoUrl}
                controls
                className="w-100 rounded-top"
              />
              
              <SectionList 
                resources={sections} 
                onSeek={(time) => {
                  if (videoRef.current) {
                    const [minutes, seconds] = time.split(":").map(Number);
                    videoRef.current.currentTime = minutes * 60 + seconds;
                    videoRef.current.play();
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Sección de comentarios */}
        <div className="col-md-4">
          <div className="bg-brown px-4 py-3 rounded h-100">
            <div className="comment-box d-flex mb-3">
              <input
                className="form-control bg-brown-light flex-grow-1 me-2"
                type="text"
                placeholder="Comentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                className="btn btn-primary rounded-circle"
                style={{ width: "40px", height: "40px" }}
                onClick={handleAddComment}
              >
                <FaPaperPlane />
              </button>
            </div>

            <div className="comment-scroll" style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
              {comments.map((comment) => (
                <div key={comment.id} className="d-flex mb-3 bg-brown-light p-2 rounded">
                  <img
                    src={comment.avatar}
                    alt={comment.name}
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px" }}
                  />
                  <div>
                    <strong>{comment.name}</strong>
                    <p className="mb-0">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}