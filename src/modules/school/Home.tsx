import { Carousel } from "./components/Carousel";
import { ModuleHighlights } from "./components/ModuleHighlights";
import { useState, useEffect } from "react";
import { Spinner, Alert, Tab, Tabs, ButtonGroup, Button } from "react-bootstrap";

interface School {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  tema: string;
}

export function Home() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("Todos");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/schools");
        if (!response.ok) throw new Error("Error al cargar escuelas");
        const data = await response.json();
        setSchools(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  // Obtener temas únicos
  const temas = ["Todos", ...new Set(schools.map(school => school.tema).filter(Boolean))];

  // Filtrar escuelas por tema seleccionado
  const filteredSchools = activeTab === "Todos" 
    ? schools 
    : schools.filter(school => school.tema === activeTab);

  return (
    <div className="page-content text-white">
      {/* Carrusel de cursos */}
      <div className="mb-5">
        <h6 className="mb-0 text-uppercase">Cursos</h6>
        <hr className="border-gray-500" />
        <Carousel />
      </div>

      {/* Módulos */}
      <ModuleHighlights />

      {/* Nuestras Escuelas - Sección modificada */}
      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0 text-uppercase">Nuestras Escuelas</h6>
          {!loading && schools.length > 0 && (
            <ButtonGroup size="sm">
              {temas.map(tema => (
                <Button
                  key={tema}
                  variant={activeTab === tema ? "primary" : "outline-secondary"}
                  onClick={() => setActiveTab(tema)}
                  className="text-white"
                >
                  {tema}
                </Button>
              ))}
            </ButtonGroup>
          )}
        </div>
        <hr className="border-gray-500" />

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" variant="light" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredSchools.length === 0 ? (
          <Alert variant="info">No hay escuelas disponibles</Alert>
        ) : (
          <div className="row g-4">
            {filteredSchools.map((school) => (
              <div key={school.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <div 
                  className="card bg-dark text-white h-100 border-0 shadow-sm"
                  onClick={() => window.location.href = `/school/cursos/${school.id}`}
                  style={{ cursor: "pointer" }}
                >
                  {school.imageUrl && (
                    <img
                      src={school.imageUrl}
                      className="card-img-top"
                      alt={school.name}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{school.name}</h5>
                    {school.tema && (
                      <span className="badge bg-primary mb-2 align-self-start">
                        {school.tema}
                      </span>
                    )}
                    <p className="card-text" style={{ flex: 1 }}>
                      {school.description.length > 100 
                        ? `${school.description.substring(0, 100)}...` 
                        : school.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}