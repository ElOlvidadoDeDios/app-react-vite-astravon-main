import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Carousel } from "./components/Carousel";
import { Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface School {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  tema: string;
}

const API_BASE_URL = "http://localhost:3001/api";

export function School() {
  const [filter, setFilter] = useState<string>("");
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/schools`);
        if (!response.ok) throw new Error("Error al cargar escuelas");
        const data = await response.json();
        setSchools(data);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const handleFilterChange = (category: string) => {
    setFilter(category);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        Error al cargar las escuelas: {error}
      </Alert>
    );
  }

  return (
    <div className="page-content">
      <button 
        className="btn btn-outline-light mb-3"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>
      <div className="row">
        {schools.map((school) => (
          <div key={school.id} className="col-md-4 mb-4">
            <div
              className="card bg-dark text-white"
              onClick={() => navigate(`/school/cursos/${school.id}`)}
              style={{ cursor: "pointer" }}
            >
              {school.imageUrl && (
                <img
                  src={school.imageUrl}
                  className="card-img-top"
                  alt={school.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{school.name}</h5>
                <p className="card-text">{school.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}