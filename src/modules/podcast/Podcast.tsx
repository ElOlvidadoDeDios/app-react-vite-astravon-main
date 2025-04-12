import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PodcastCard from "./components/PodcastCard";
import { Link, useSearchParams } from "react-router-dom";

interface PodcastProgram {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  total_duration: string;
  updated_at: string;
  episodes_count?: number;
}

const API_URL = 'http://localhost:3001';

export function Podcast() {
  const [programs, setPrograms] = useState<PodcastProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || "Todos";

  // Obtener categorías únicas
  const categories = ["Todos", ...new Set(programs.map((p) => p.category))];

  // Filtrar programas
  const filteredPrograms = selectedCategory === "Todos" 
    ? programs 
    : programs.filter((p) => p.category === selectedCategory);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/podcasts/programs`);
        if (!response.ok) throw new Error('Error al cargar programas');
        const data = await response.json();
        setPrograms(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleCategoryChange = (category: string) => {
    setSearchParams({ category });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        Error al cargar los programas: {error}
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="d-flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`btn ${
              selectedCategory === category
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => handleCategoryChange(category)}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
        ))}
      </div>

      <h6 className="mb-0 text-uppercase text-white">Programas que podrían gustarte</h6>
      <hr />

      {filteredPrograms.length === 0 ? (
        <div className="alert alert-info">
          No hay programas disponibles en la categoría "{selectedCategory}"
        </div>
      ) : (
        <div className="row g-4 justify-content-left">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 d-flex mb-4"
            >
              <PodcastCard 
                podcast={{
                  id: program.id,
                  title: program.title,
                  date: new Date(program.updated_at).toLocaleDateString(),
                  duration: program.total_duration,
                  image: program.image_url,
                  category: program.category,
                  episodes_count: program.episodes_count
                }} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}