import { useState, useEffect } from "react";
import { Spinner, Alert, Button, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Module {
  id: number;
  name: string;
  description: string;
  level: string;
  schoolId: number;
  schoolName: string;
}

export function ModuleHighlights() {
  const [allModules, setAllModules] = useState<Module[]>([]);
  const [filteredModules, setFilteredModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("Todos");
  const navigate = useNavigate();

  // Niveles disponibles para filtrar
  const levels = ["Todos", "Básico", "Intermedio", "Avanzado"];

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/modules");
        if (!response.ok) throw new Error("Error al cargar módulos");
        const data = await response.json();
        setAllModules(data);
        setFilteredModules(data.slice()); // Mostrar inicialmente 3 módulos
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  // Función para filtrar módulos por nivel
  const filterModulesByLevel = (level: string) => {
    setSelectedLevel(level);
    
    if (level === "Todos") {
      setFilteredModules(allModules.slice(0, 3)); // Mostrar 3 módulos aleatorios
    } else {
      const filtered = allModules
        .filter(module => module.level === level)
        .slice(0, 3); // Limitar a 3 módulos
      setFilteredModules(filtered);
    }
  };

  if (loading) return <Spinner animation="border" variant="light" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0 text-uppercase">Módulos</h6>
        <ButtonGroup size="sm">
          {levels.map(level => (
            <Button
              key={level}
              variant={selectedLevel === level ? "primary" : "outline-secondary"}
              onClick={() => filterModulesByLevel(level)}
            >
              {level}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <hr className="border-gray-500" />

      {filteredModules.length > 0 ? (
        <div className="row">
          {filteredModules.map((module) => (
            <div key={module.id} className="col-md-4 mb-4">
              <div 
                className="card bg-dark text-white cursor-pointer h-100"
                onClick={() => navigate(`/school/cursos/${module.schoolId}`)}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{module.name}</h5>
                  <span className={`badge ${
                    module.level === "Básico" ? "bg-success" :
                    module.level === "Intermedio" ? "bg-warning text-dark" :
                    "bg-danger"
                  } mb-2 align-self-start`}>
                    {module.level}
                  </span>
                  <p className="card-text flex-grow-1">{module.description}</p>
                  <small className="text-muted">{module.schoolName}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Alert variant="info">
          No hay módulos disponibles en el nivel {selectedLevel}
        </Alert>
      )}
    </div>
  );
}