import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface School {
  id?: number;
  name: string;
  description: string;
  imageUrl: string;
  tema: string;
}

interface Module {
  id?: number;
  schoolId: number;
  name: string;
  description: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  order: number;
  schoolName?: string;
}

interface Course {
  id?: number;
  moduleId: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  duration: string;
  order: number;
  moduleName?: string;
}

interface Section {
  id?: number;
  courseId: number;
  resourceName: string;
  instructions: string;
  externalUrl: string;
  order: number;
  courseTitle?: string;
}

const API_URL = 'http://localhost:3001/api';

export function AdminPanel() {
  const [schools, setSchools] = useState<School[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('schools');
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [courseFile, setCourseFile] = useState<File | null>(null);
  const [sectionVideoFile, setSectionVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingCourse, setUploadingCourse] = useState(false);
  const [uploadingSection, setUploadingSection] = useState(false);
  const [courseVideoFile, setCourseVideoFile] = useState<File | null>(null);

  // Form states
  const [newSchool, setNewSchool] = useState<School>({ 
    name: '', 
    description: '', 
    imageUrl: '',
    tema: '',
  });
  const [newModule, setNewModule] = useState<Module>({ 
    schoolId: 0, 
    name: '', 
    description: '', 
    level: 'Básico', 
    order: 0 
  });
  const [newCourse, setNewCourse] = useState<Course>({ 
    moduleId: 0, 
    title: '', 
    description: '', 
    imageUrl: '', 
    videoUrl: '', 
    duration: '', 
    order: 0 
  });
  const [newSection, setNewSection] = useState<Section>({ 
    courseId: 0, 
    resourceName: '', 
    instructions: '', 
    externalUrl: '', 
    order: 0 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener todas las escuelas
        const schoolsResponse = await fetch(`${API_URL}/schools`);
        const schoolsData = await schoolsResponse.json();
        setSchools(schoolsData);

        // Obtener todos los módulos
        const modulesResponse = await fetch(`${API_URL}/modules`);
        const modulesData = await modulesResponse.json();
        setModules(modulesData);

        // Obtener todos los cursos
        const coursesResponse = await fetch(`${API_URL}/courses`);
        const coursesData = await coursesResponse.json();
        setCourses(coursesData);

        // Obtener todas las secciones
        const sectionsResponse = await fetch(`${API_URL}/sections`);
        const sectionsData = await sectionsResponse.json();
        setSections(sectionsData);

        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datosde las escuelas');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Funciones para Escuelas
  // Agregar Escuela
  const handleAddSchool = async () => {
    try {
      let imageUrl = newSchool.imageUrl;
      
      // Si hay un archivo para subir
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadResponse = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Error al subir la imagen');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }
  
      const response = await fetch(`${API_URL}/schools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSchool,
          imageUrl
         }),
      });
      
      if (!response.ok) {
        throw new Error('Error al agregar escuela');
      }
      
      const addedSchool = await response.json();
      
      // Obtener datos actualizados del servidor
      const [schoolsResponse, modulesResponse] = await Promise.all([
        fetch(`${API_URL}/schools`),
        fetch(`${API_URL}/modules`),
      ]);
      
      const [schoolsData, modulesData] = await Promise.all([
        schoolsResponse.json(),
        modulesResponse.json(),
      ]);
      
      setSchools(schoolsData);
      setModules(modulesData);
      setNewSchool({ name: '', description: '', imageUrl: '' });
      setFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Editar Escuela
  const handleEditSchool = async () => {
    try {
      const response = await fetch(`${API_URL}/schools/${newSchool.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchool),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar escuela');
      }
      
      // Obtener datos actualizados del servidor
      const [schoolsResponse, modulesResponse] = await Promise.all([
        fetch(`${API_URL}/schools`),
        fetch(`${API_URL}/modules`),
      ]);
      
      const [schoolsData, modulesData] = await Promise.all([
        schoolsResponse.json(),
        modulesResponse.json(),
      ]);
      
      setSchools(schoolsData);
      setModules(modulesData);
      setNewSchool({ name: '', description: '', imageUrl: '', tema: '' });
      setFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar Escuela
  const handleDeleteSchool = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/schools/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar escuela');
      }
      
      // Obtener datos actualizados del servidor
      const [schoolsResponse, modulesResponse] = await Promise.all([
        fetch(`${API_URL}/schools`),
        fetch(`${API_URL}/modules`),
      ]);
      
      const [schoolsData, modulesData] = await Promise.all([
        schoolsResponse.json(),
        modulesResponse.json(),
      ]);
      
      setSchools(schoolsData);
      setModules(modulesData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Funciones para Módulos
  // Agregar Módulo
  const handleAddModule = async () => {
    try {
      const response = await fetch(`${API_URL}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newModule),
      });
      
      if (!response.ok) {
        throw new Error('Error al agregar módulo');
      }
      
      // Obtener datos actualizados del servidor
      const [modulesResponse, coursesResponse] = await Promise.all([
        fetch(`${API_URL}/modules`),
        fetch(`${API_URL}/courses`),
      ]);
      
      const [modulesData, coursesData] = await Promise.all([
        modulesResponse.json(),
        coursesResponse.json(),
      ]);
      
      // Enriquecer módulos con nombres de escuela
      const enrichedModules = modulesData.map(module => ({
        ...module,
        schoolName: schools.find(s => s.id === module.schoolId)?.name || 'Sin escuela'
      }));
      
      setModules(enrichedModules);
      setCourses(coursesData);
      setNewModule({ 
        schoolId: 0, 
        name: '', 
        description: '', 
        level: 'Básico', 
        order: 0 
      });
      setFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Editar Módulo
  const handleEditModule = async () => {
    try {
      const response = await fetch(`${API_URL}/modules/${newModule.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newModule),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar módulo');
      }
      
      // Obtener datos actualizados del servidor
      const [modulesResponse, coursesResponse] = await Promise.all([
        fetch(`${API_URL}/modules`),
        fetch(`${API_URL}/courses`),
      ]);
      
      const [modulesData, coursesData] = await Promise.all([
        modulesResponse.json(),
        coursesResponse.json(),
      ]);
      
      // Enriquecer módulos con nombres de escuela
      const enrichedModules = modulesData.map(module => ({
        ...module,
        schoolName: schools.find(s => s.id === module.schoolId)?.name || 'Sin escuela'
      }));
      
      setModules(enrichedModules);
      setCourses(coursesData);
      setNewModule({ 
        schoolId: 0, 
        name: '', 
        description: '', 
        level: 'Básico', 
        order: 0 
      });
      setFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar Módulo
  const handleDeleteModule = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/modules/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar módulo');
      }
      
      // Obtener datos actualizados del servidor
      const [modulesResponse, coursesResponse] = await Promise.all([
        fetch(`${API_URL}/modules`),
        fetch(`${API_URL}/courses`),
      ]);
      
      const [modulesData, coursesData] = await Promise.all([
        modulesResponse.json(),
        coursesResponse.json(),
      ]);
      
      // Enriquecer módulos con nombres de escuela
      const enrichedModules = modulesData.map(module => ({
        ...module,
        schoolName: schools.find(s => s.id === module.schoolId)?.name || 'Sin escuela'
      }));
      
      setModules(enrichedModules);
      setCourses(coursesData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Funciones para Cursos
  // Agregar Curso
  const handleAddCourse = async () => {
    try {
      setUploadingCourse(true);
      let imageUrl = newCourse.imageUrl;
      let videoUrl = newCourse.videoUrl;
  
      // Subir imagen (si hay archivo)
      if (courseFile) {
        const imageFormData = new FormData();
        imageFormData.append('file', courseFile);
        const imageUploadResponse = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: imageFormData,
        });
        if (!imageUploadResponse.ok) throw new Error('Error al subir la imagen');
        const imageData = await imageUploadResponse.json();
        imageUrl = imageData.url;
      }
  
      // Subir video (si hay archivo)
      if (courseVideoFile) {
        const videoFormData = new FormData();
        videoFormData.append('file', courseVideoFile); // Asegúrate de que el backend espere 'video'
        const videoUploadResponse = await fetch(`${API_URL}/upload`, { // Ruta específica para videos
          method: 'POST',
          body: videoFormData,
        });
        if (!videoUploadResponse.ok) throw new Error('Error al subir el video');
        const videoData = await videoUploadResponse.json();
        videoUrl = videoData.url;
      }
  
      // Guardar el curso
      const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCourse, imageUrl, videoUrl }),
      });
  
      if (!response.ok) throw new Error('Error al agregar curso');
  
      // Resto de la lógica (actualizar lista de cursos, etc.)
      const [coursesResponse, sectionsResponse] = await Promise.all([
        fetch(`${API_URL}/courses`),
        fetch(`${API_URL}/sections`),
      ]);
      const [coursesData, sectionsData] = await Promise.all([
        coursesResponse.json(),
        sectionsResponse.json(),
      ]);
  
      const enrichedCourses = coursesData.map(course => ({
        ...course,
        moduleName: modules.find(m => m.id === course.moduleId)?.name || 'Sin módulo',
      }));
  
      setCourses(enrichedCourses);
      setSections(sectionsData);
      setNewCourse({ 
        moduleId: 0, 
        title: '', 
        description: '', 
        imageUrl: '', 
        videoUrl: '', 
        duration: '', 
        order: 0 
      });
      setFile(null);
      setCourseFile(null);
      setCourseVideoFile(null); // Limpiar el archivo de video
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingCourse(false);
    }
  };
  // Editar Curso
  const handleEditCourse = async () => {
    try {
      const response = await fetch(`${API_URL}/courses/${newCourse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar curso');
      }
      
      // Obtener datos actualizados del servidor
      const [coursesResponse, sectionsResponse] = await Promise.all([
        fetch(`${API_URL}/courses`),
        fetch(`${API_URL}/sections`),
      ]);
      
      const [coursesData, sectionsData] = await Promise.all([
        coursesResponse.json(),
        sectionsResponse.json(),
      ]);
      
      // Enriquecer cursos con nombres de módulo
      const enrichedCourses = coursesData.map(course => ({
        ...course,
        moduleName: modules.find(m => m.id === course.moduleId)?.name || 'Sin módulo'
      }));
      
      setCourses(enrichedCourses);
      setSections(sectionsData);
      setNewCourse({ 
        moduleId: 0, 
        title: '', 
        description: '', 
        imageUrl: '', 
        videoUrl: '', 
        duration: '', 
        order: 0 
      });
      setFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar Curso
  const handleDeleteCourse = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/courses/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar curso');
      }
      
      // Obtener datos actualizados del servidor
      const [coursesResponse, sectionsResponse] = await Promise.all([
        fetch(`${API_URL}/courses`),
        fetch(`${API_URL}/sections`),
      ]);
      
      const [coursesData, sectionsData] = await Promise.all([
        coursesResponse.json(),
        sectionsResponse.json(),
      ]);
      
      // Enriquecer cursos con nombres de módulo
      const enrichedCourses = coursesData.map(course => ({
        ...course,
        moduleName: modules.find(m => m.id === course.moduleId)?.name || 'Sin módulo'
      }));
      
      setCourses(enrichedCourses);
      setSections(sectionsData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Funciones para Secciones
  // Agregar Sección
  const handleAddSection = async () => {
    try {
      setUploadingSection(true);
      let videoUrl = newSection.videoUrl;
      
      if (sectionVideoFile) {
        const formData = new FormData();
        formData.append('file', sectionVideoFile);
        
        const uploadResponse = await fetch(`${API_URL}/upload`, {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Error al subir el video de la sección');
        }
        
        const uploadData = await uploadResponse.json();
        videoUrl = uploadData.url;
      }
  
      const response = await fetch(`${API_URL}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newSection, videoUrl }),
      });
      
      if (!response.ok) {
        throw new Error('Error al agregar sección');
      }
      
      // Obtener datos actualizados
      const sectionsResponse = await fetch(`${API_URL}/sections`);
      const sectionsData = await sectionsResponse.json();
      
      // Enriquecer secciones
      const enrichedSections = sectionsData.map(section => ({
        ...section,
        courseTitle: courses.find(c => c.id === section.courseId)?.title || 'Sin curso'
      }));
      
      setSections(enrichedSections);
      setNewSection({ 
        courseId: 0, 
        resourceName: '', 
        instructions: '', 
        externalUrl: '', 
        order: 0 
      });
      setFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingSection(false);
    }
  };

  // Editar Sección
  const handleEditSection = async () => {
    try {
      const response = await fetch(`${API_URL}/sections/${newSection.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSection),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar sección');
      }
      
      // Obtener datos actualizados del servidor
      const sectionsResponse = await fetch(`${API_URL}/sections`);
      const sectionsData = await sectionsResponse.json();
      
      // Enriquecer secciones con títulos de curso
      const enrichedSections = sectionsData.map(section => ({
        ...section,
        courseTitle: courses.find(c => c.id === section.courseId)?.title || 'Sin curso'
      }));
      
      setSections(enrichedSections);
      setNewSection({ 
        courseId: 0, 
        resourceName: '', 
        instructions: '', 
        externalUrl: '', 
        order: 0 
      });
      setFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar Sección
  const handleDeleteSection = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/sections/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar sección');
      }
      
      // Obtener datos actualizados del servidor
      const sectionsResponse = await fetch(`${API_URL}/sections`);
      const sectionsData = await sectionsResponse.json();
      
      // Enriquecer secciones con títulos de curso
      const enrichedSections = sectionsData.map(section => ({
        ...section,
        courseTitle: courses.find(c => c.id === section.courseId)?.title || 'Sin curso'
      }));
      
      setSections(enrichedSections);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = (type: 'school' | 'module' | 'course' | 'section') => {
    switch (type) {
      case 'school':
        setNewSchool({ name: '', description: '', imageUrl: '', tema: '' });
        break;
      case 'module':
        setNewModule({ schoolId: 0, name: '', description: '', level: 'Básico', order: 0 });
        break;
      case 'course':
        setNewCourse({ moduleId: 0, title: '', description: '', imageUrl: '', videoUrl: '', duration: '', order: 0 });
        break;
      case 'section':
        setNewSection({ courseId: 0, title: '', description: '', videoUrl: '', duration: '', order: 0 });
        break;
    }
  };

  if (loading) return <div className="text-white">Cargando...</div>;
  if (error) return <div className="text-white text-danger">{error}</div>;

  return (
    <div className="page-content text-white p-4">
      <h2 className="mb-4">Panel de Administración</h2>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => {
          setActiveTab(k || 'schools');
          resetForm('school');
          resetForm('module');
          resetForm('course');
          resetForm('section');
        }}
        className="mb-3"
        id="admin-tabs"
      >
        {/* Pestaña de Escuelas */}
        <Tab eventKey="schools" title="Escuelas">
          <h3 className="mt-4">Escuelas</h3>
          <div className="row">
            {schools.map(school => (
              <div key={school.id} className="col-md-4 mb-4">
                <div className="card bg-dark text-white">
                  {school.imageUrl && (
                    <img src={school.imageUrl} className="card-img-top" alt={school.name} />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{school.name}</h5>
                    <p className="card-text">{school.description}</p>
                    {school.tema && (
                      <span className="badge bg-primary mb-2">{school.tema}</span>
                    )}
                    <div className="d-flex justify-content-end gap-2">
                      <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                          setNewSchool(school);
                          setActiveTab('schools');
                        }}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteSchool(school.id!)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-dark rounded">
            <h4>{newSchool.id ? 'Editar Escuela' : 'Agregar Nueva Escuela'}</h4>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input 
                type="text" 
                className="form-control bg-secondary text-white" 
                value={newSchool.name}
                onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea 
                className="form-control bg-secondary text-white" 
                value={newSchool.description}
                onChange={(e) => setNewSchool({...newSchool, description: e.target.value})}
              />
            </div><div className="mb-3">
              <label className="form-label">Tema</label>
              <input 
                type="text" 
                className="form-control bg-secondary text-white" 
                value={newSchool.tema}
                onChange={(e) => setNewSchool({...newSchool, tema: e.target.value})}
                placeholder="Ej: Programación, Diseño, Marketing"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Imagen</label>
              <input 
                type="file" 
                className="form-control bg-secondary text-white" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                    // Mostrar vista previa si quieres
                    setNewSchool({...newSchool, imageUrl: URL.createObjectURL(e.target.files[0])});
                  }
                }}
              />
              {newSchool.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={newSchool.imageUrl} 
                    alt="Vista previa" 
                    style={{ maxWidth: '200px', maxHeight: '200px' }} 
                  />
                </div>
              )}
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary" 
                onClick={newSchool.id ? handleEditSchool : handleAddSchool}
              >
                {newSchool.id ? 'Actualizar' : 'Agregar'}
              </button>
              {newSchool.id && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => resetForm('school')}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </Tab>

        {/* Pestaña de Módulos */}
        <Tab eventKey="modules" title="Módulos">
          <h3 className="mt-4">Módulos</h3>
          <div className="row">
            {modules.map(module => (
              <div key={module.id} className="col-md-6 mb-4">
                <div className="card bg-dark text-white">
                  <div className="card-body">
                    <h5 className="card-title">{module.name || 'Módulo sin nombre'}</h5>
                    <p className="card-text">{module.description || 'Sin descripción'}</p>
                    
                    <div className="module-details mt-3">
                      <div className="detail-row">
                        <span className="detail-label">Nivel:</span>
                        <span className="detail-value">{module.level || 'No especificado'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Orden:</span>
                        <span className="detail-value">{module.order || '0'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Escuela:</span>
                        <span className="detail-value">{module.schoolName || 'Sin escuela asignada'}</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                          setNewModule(module);
                          setActiveTab('modules');
                        }}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteModule(module.id!)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-dark rounded">
            <h4>{newModule.id ? 'Editar Módulo' : 'Agregar Nuevo Módulo'}</h4>
            <div className="mb-3">
              <label className="form-label">Escuela</label>
              <select 
                className="form-select bg-dark text-white"
                value={newModule.schoolId}
                onChange={(e) => setNewModule({...newModule, schoolId: Number(e.target.value)})}
              >
                <option value="0" className="bg-secondary text-white">Seleccionar Escuela</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name || `Escuela ${school.id}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input 
                type="text" 
                className="form-control bg-secondary text-white" 
                value={newModule.name}
                onChange={(e) => setNewModule({...newModule, name: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea 
                className="form-control bg-secondary text-white" 
                value={newModule.description}
                onChange={(e) => setNewModule({...newModule, description: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nivel</label>
              <select 
                className="form-select bg-secondary text-white"
                value={newModule.level}
                onChange={(e) => setNewModule({...newModule, level: e.target.value as any})}
              >
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Orden</label>
              <input 
                type="number" 
                className="form-control bg-secondary text-white" 
                value={newModule.order}
                onChange={(e) => setNewModule({...newModule, order: parseInt(e.target.value)})}
              />
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary" 
                onClick={newModule.id ? handleEditModule : handleAddModule}
              >
                {newModule.id ? 'Actualizar' : 'Agregar'}
              </button>
              {newModule.id && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => resetForm('module')}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </Tab>

        {/* Pestaña de Cursos */}
        <Tab eventKey="courses" title="Cursos">
          <h3 className="mt-4">Cursos</h3>
          <div className="row">
            {courses.map(course => (
              <div key={course.id} className="col-md-4 mb-4">
                <div className="card bg-dark text-white">
                  {course.imageUrl && (
                    <img src={course.imageUrl} className="card-img-top" alt={course.title} style={{ height: '180px', objectFit: 'cover' }} />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{course.title || 'Curso sin título'}</h5>
                    <p className="card-text">{course.description || 'Sin descripción'}</p>
                    
                    <div className="course-details mt-3">
                      <div className="detail-row">
                        <span className="detail-label">Módulo:</span>
                        <span className="detail-value">{course.moduleName || 'No asignado'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Duración:</span>
                        <span className="detail-value">{course.duration || 'No especificada'}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Orden:</span>
                        <span className="detail-value">{course.order || '0'}</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                          setNewCourse(course);
                          setActiveTab('courses');
                        }}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteCourse(course.id!)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-dark rounded">
            <h4>{newCourse.id ? 'Editar Curso' : 'Agregar Nuevo Curso'}</h4>
            <div className="mb-3">
              <label className="form-label">Módulo</label>
              <select 
                className="form-select bg-dark text-white"
                value={newCourse.moduleId}
                onChange={(e) => setNewCourse({...newCourse, moduleId: Number(e.target.value)})}
              >
                <option value="0">Seleccionar Módulo</option>
                {modules.map(module => {
                  const moduleName = module.name || `Módulo ${module.id}`;
                  const schoolName = module.schoolName;
                  
                  return (
                    <option key={module.id} value={module.id}>
                      {moduleName} {schoolName ? `- ${schoolName}` : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Título</label>
              <input 
                type="text" 
                className="form-control bg-secondary text-white" 
                value={newCourse.title}
                onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea 
                className="form-control bg-secondary text-white" 
                value={newCourse.description}
                onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Imagen del Curso</label>
              <input 
                type="file" 
                className="form-control bg-secondary text-white"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCourseFile(e.target.files[0]);
                    setNewCourse({
                      ...newCourse,
                      imageUrl: URL.createObjectURL(e.target.files[0]),
                    });
                  }
                }}
              />
              {newCourse.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={newCourse.imageUrl} 
                    alt="Vista previa" 
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                    className="img-thumbnail"
                  />
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Video del Curso</label>
              <input 
                type="file" 
                className="form-control bg-secondary text-white"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setCourseVideoFile(e.target.files[0]);
                    setNewCourse({
                      ...newCourse,
                      videoUrl: URL.createObjectURL(e.target.files[0]), // Vista previa opcional
                    });
                  }
                }}
              />
              {newCourse.videoUrl && (
                <div className="mt-2">
                  <video 
                    src={newCourse.videoUrl} 
                    controls 
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Duración</label>
              <input 
                type="text" 
                className="form-control bg-secondary text-white" 
                value={newCourse.duration}
                onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Orden</label>
              <input 
                type="number" 
                className="form-control bg-secondary text-white" 
                value={newCourse.order}
                onChange={(e) => setNewCourse({...newCourse, order: parseInt(e.target.value)})}
              />
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-primary" 
                onClick={newCourse.id ? handleEditCourse : handleAddCourse}
                disabled={uploadingCourse}
              >
                {uploadingCourse ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Subiendo...
                  </>
                ) : (
                  newCourse.id ? 'Actualizar' : 'Agregar'
                )}
              </button>
              {newCourse.id && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => resetForm('course')}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </Tab>

        {/* Pestaña de Secciones */}
        {/* En la pestaña de Recursos */}
        <Tab eventKey="sections" title="Secciones">
          <h3 className="mt-4">Secciones/Recursos</h3>
          <div className="row">
            {sections.map(section => (
              <div key={section.id} className="col-md-6 mb-4">
                <div className="card bg-dark text-white">
                  <div className="card-body">
                    <h5 className="card-title">{section.resourceName || 'Recurso sin nombre'}</h5>
                    
                    <div className="section-details mt-3">
                      <div className="detail-row mb-2">
                        <span className="detail-label fw-bold">Curso:</span>
                        <span className="detail-value">{section.courseTitle || 'No asignado'}</span>
                      </div>
                      <div className="detail-row mb-2">
                        <span className="detail-label fw-bold">Instrucciones:</span>
                        <p className="detail-value">{section.instructions || 'Sin instrucciones'}</p>
                      </div>
                      <div className="detail-row mb-2">
                        <span className="detail-label fw-bold">Enlace externo:</span>
                        {section.externalUrl ? (
                          <a href={section.externalUrl} target="_blank" rel="noopener noreferrer" className="text-primary">
                            Ver enlace
                          </a>
                        ) : (
                          <span>No especificado</span>
                        )}
                      </div>
                      <div className="detail-row">
                        <span className="detail-label fw-bold">Orden:</span>
                        <span className="detail-value">{section.order || '0'}</span>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <button 
                        className="btn btn-sm btn-warning"
                        onClick={() => {
                          setNewSection(section);
                          setActiveTab('sections');
                        }}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteSection(section.id!)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulario para agregar/editar */}
          <div className="mt-4 p-4 bg-dark rounded">
            <h4>{newSection.id ? 'Editar Sección' : 'Agregar Nueva Sección'}</h4>
            
            <div className="mb-3">
              <label className="form-label">Curso</label>
              <select 
                className="form-select bg-dark text-white"
                value={newSection.courseId}
                onChange={(e) => setNewSection({...newSection, courseId: Number(e.target.value)})}
              >
                <option value="0">Seleccionar Curso</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title || `Curso ${course.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Nombre del Recurso</label>
              <input
                type="text"
                className="form-control bg-secondary text-white"
                value={newSection.resourceName}
                onChange={(e) => setNewSection({...newSection, resourceName: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Instrucciones</label>
              <textarea
                className="form-control bg-secondary text-white"
                rows={3}
                value={newSection.instructions}
                onChange={(e) => setNewSection({...newSection, instructions: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Enlace Externo</label>
              <input
                type="url"
                className="form-control bg-secondary text-white"
                value={newSection.externalUrl}
                onChange={(e) => setNewSection({...newSection, externalUrl: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Orden</label>
              <input
                type="number"
                className="form-control bg-secondary text-white"
                value={newSection.order}
                onChange={(e) => setNewSection({...newSection, order: parseInt(e.target.value) || 0})}
              />
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                onClick={newSection.id ? handleEditSection : handleAddSection}
              >
                {newSection.id ? 'Actualizar' : 'Agregar'}
              </button>
              {newSection.id && (
                <button
                  className="btn btn-secondary"
                  onClick={() => resetForm('section')}
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}