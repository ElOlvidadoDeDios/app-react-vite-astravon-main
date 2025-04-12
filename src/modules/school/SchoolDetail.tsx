import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner, Alert, Badge, Button, ButtonGroup } from "react-bootstrap";
import { CourseCard } from "./components/CourseCard";

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  level: string;
  moduleId: number;
  moduleName?: string;
}

interface Module {
  id: number;
  name: string;
  level: string;
  schoolId: number;
}

const API_BASE_URL = "http://localhost:3001/api";

export default function SchoolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("Básico");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [modulesRes, coursesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/modules?schoolId=${id}`),
          fetch(`${API_BASE_URL}/courses`)
        ]);

        if (!modulesRes.ok || !coursesRes.ok) throw new Error("Error al cargar datos");
        
        const [modulesData, coursesData] = await Promise.all([
          modulesRes.json(),
          coursesRes.json()
        ]);

        const enrichedCourses = coursesData.map((course: Course) => {
          const module = modulesData.find((m: Module) => m.id === course.moduleId);
          return {
            ...course,
            moduleName: module?.name,
            level: module?.level
          };
        });

        setModules(modulesData);
        setCourses(enrichedCourses);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Agrupar módulos por nivel
  const modulesByLevel = modules.reduce((acc, module) => {
    if (!acc[module.level]) {
      acc[module.level] = [];
    }
    acc[module.level].push(module);
    return acc;
  }, {} as Record<string, Module[]>);

  // Obtener cursos por módulo
  const getCoursesByModule = (moduleId: number) => {
    return courses.filter(course => course.moduleId === moduleId);
  };

  // Obtener todos los cursos del nivel seleccionado
  const getCoursesByLevel = () => {
    return courses.filter(course => course.level === selectedLevel);
  };

  // Orden de los niveles
  const levelOrder = ["Básico", "Intermedio", "Avanzado"];

  if (loading) return <Spinner animation="border" variant="light" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="page-content py-4 text-white">
      <button 
        className="btn btn-outline-light mb-3"
        onClick={() => navigate(-1)}
      >
        ← Volver a las escuelas
      </button>

      <h3 className="mb-4">Módulos y Cursos</h3>

      {/* Selector de Niveles */}
      <div className="mb-4">
        <h5>Selecciona un nivel:</h5>
        <ButtonGroup className="mb-3">
          {levelOrder.map(level => (
            <Button
              key={level}
              variant={selectedLevel === level ? "primary" : "outline-secondary"}
              onClick={() => {
                setSelectedLevel(level);
                setSelectedModule(null); // Resetear módulo seleccionado al cambiar nivel
              }}
            >
              {level}
              <Badge bg="light" text="dark" className="ms-2">
                {modulesByLevel[level]?.length || 0}
              </Badge>
            </Button>
          ))}
        </ButtonGroup>
      </div>

      {/* Selector de Módulos (solo si hay módulos en el nivel) */}
      {modulesByLevel[selectedLevel]?.length > 0 && (
        <div className="mb-4">
          <h5>Módulos de nivel {selectedLevel}:</h5>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Button
              variant={!selectedModule ? "primary" : "outline-secondary"}
              onClick={() => setSelectedModule(null)}
            >
              Todos
            </Button>
            {modulesByLevel[selectedLevel].map(module => (
              <Button
                key={module.id}
                variant={selectedModule === module.id ? "primary" : "outline-secondary"}
                onClick={() => setSelectedModule(module.id)}
              >
                {module.name}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Cursos */}
      <div className="mt-4">
        <h4>
          {selectedModule 
            ? `Cursos del módulo: ${modules.find(m => m.id === selectedModule)?.name}`
            : `Todos los cursos de nivel ${selectedLevel}`}
        </h4>

        <div className="row">
          {(selectedModule 
            ? getCoursesByModule(selectedModule) 
            : getCoursesByLevel()).map((course) => (
            <div key={course.id} className="col-12 col-md-4 mb-4">
              <CourseCard course={course} />
            </div>
          ))}
        </div>

        {(selectedModule 
          ? getCoursesByModule(selectedModule).length === 0
          : getCoursesByLevel().length === 0) && (
          <Alert variant="info">
            No hay cursos disponibles en esta selección
          </Alert>
        )}
      </div>
    </div>
  );
}