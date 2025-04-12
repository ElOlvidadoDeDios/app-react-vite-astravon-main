import { useState, useEffect } from "react";
import { Tab, Tabs, Modal, Button, Form, Row, Col, Alert, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface PodcastProgram {
  id?: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
}

interface PodcastEpisode {
  id?: number;
  program_id: number;
  title: string;
  description: string;
  audio_url: string;
  duration: string;
  episode_number: number;
  publish_date: string;
}

const API_URL = 'http://localhost:3001';

export function PodcastAdminPanel() {
  const [programs, setPrograms] = useState<PodcastProgram[]>([]);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('programs');
  const [showEpisodeModal, setShowEpisodeModal] = useState(false);

  // Estados para archivos
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Estados para formularios
  const [newProgram, setNewProgram] = useState<PodcastProgram>({ 
    title: '', 
    description: '', 
    image_url: '', 
    category: '' 
  });

  const [newEpisode, setNewEpisode] = useState<PodcastEpisode>({ 
    program_id: programs[0]?.id || 0,
    title: '',
    description: '',
    audio_url: '',
    duration: '',
    episode_number: 1,
    publish_date: new Date().toISOString().split('T')[0]
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [programsRes, episodesRes] = await Promise.all([
          fetch(`${API_URL}/api/podcasts/programs`),
          fetch(`${API_URL}/api/podcasts/episodes`)
        ]);
        
        if (!programsRes.ok) throw new Error('Error al cargar programas');
        if (!episodesRes.ok) throw new Error('Error al cargar episodios');
        
        const [programsData, episodesData] = await Promise.all([
          programsRes.json(),
          episodesRes.json()
        ]);
        
        setPrograms(programsData);
        setEpisodes(episodesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Subir imagen a Cloudinary
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir imagen');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error('Error al subir imagen:', err);
      throw err;
    }
  };

  // Subir audio a Cloudinary
  const uploadAudio = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/upload-audio`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al subir audio');
      }

      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error('Error al subir audio:', err);
      throw err;
    }
  };

  // Validar formulario de programa
  const validateProgram = (program: PodcastProgram): boolean => {
    if (!program.title.trim()) {
      setError('El título del programa es requerido');
      return false;
    }
    if (!program.category.trim()) {
      setError('La categoría es requerida');
      return false;
    }
    // No requerir imagen si estamos editando y no se cambió
    if (!program.id && !imageFile) {
      setError('La imagen del programa es requerida');
      return false;
    }
    return true;
  };

  // Validar formulario de episodio
  const validateEpisode = (episode: PodcastEpisode): boolean => {
    if (!episode.program_id) {
      setError('Debes seleccionar un programa');
      return false;
    }
    if (!episode.title.trim()) {
      setError('El título del episodio es requerido');
      return false;
    }
    if (!episode.episode_number || episode.episode_number < 1) {
      setError('El número de episodio debe ser mayor a 0');
      return false;
    }
    // No requerir audio si estamos editando y no se cambió
    if (!episode.id && !audioFile) {
      setError('El archivo de audio es requerido');
      return false;
    }
    return true;
  };

  // Manejar programas
  const handleAddProgram = async () => {
    try {
      if (!validateProgram(newProgram)) return;

      setUploading(true);
      setError(null);

      const imageUrl = imageFile ? await uploadImage(imageFile) : newProgram.image_url;

      const response = await fetch(`${API_URL}/api/podcasts/programs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProgram, image_url: imageUrl })
      });
      
      if (!response.ok) throw new Error('Error al agregar programa');
      
      const addedProgram = await response.json();
      setPrograms([...programs, addedProgram]);
      resetProgramForm();
      setSuccess('Programa agregado correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProgram = async () => {
    try {
      if (!validateProgram(newProgram)) return;
      if (!newProgram.id) {
        setError('ID de programa no válido');
        return;
      }
  
      setUploading(true);
      setError(null);
  
      let imageUrl = newProgram.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
  
      const response = await fetch(`${API_URL}/api/podcasts/programs/${newProgram.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newProgram, 
          image_url: imageUrl 
        })
      });
  
      if (!response.ok) throw new Error('Error al actualizar programa');
  
      const updatedProgram = await response.json();
      setPrograms(programs.map(p => p.id === updatedProgram.id ? updatedProgram : p));
      resetProgramForm();
      setSuccess('Programa actualizado correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProgram = async (programId: number) => {
    try {
      if (!window.confirm('¿Estás seguro de que deseas eliminar este programa? Todos sus episodios también serán eliminados.')) {
        return;
      }
  
      setLoading(true);
      setError(null);
  
      const response = await fetch(`${API_URL}/api/podcasts/programs/${programId}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) throw new Error('Error al eliminar programa');
  
      // Eliminar los episodios asociados localmente
      setEpisodes(episodes.filter(episode => episode.program_id !== programId));
      
      // Eliminar el programa
      setPrograms(programs.filter(program => program.id !== programId));
      
      setSuccess('Programa eliminado correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar episodios
  const getAudioDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      const url = URL.createObjectURL(file);
      
      audio.src = url;
      audio.addEventListener('loadedmetadata', () => {
        const duration = audio.duration; // Duración en segundos
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`${minutes} min ${seconds} sec`);
        URL.revokeObjectURL(url);
      });
      
      audio.addEventListener('error', () => {
        resolve('0 min'); // Valor por defecto si hay error
        URL.revokeObjectURL(url);
      });
    });
  };

  const handleAddEpisode = async () => {
    try {
      if (!validateEpisode(newEpisode)) return;

      setUploading(true);
      setError(null);

      const audioUrl = await uploadAudio(audioFile!);

      const response = await fetch(`${API_URL}/api/podcasts/episodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newEpisode, 
          audio_url: audioUrl,
          program_id: Number(newEpisode.program_id),
          episode_number: Number(newEpisode.episode_number)
        })
      });
      
      if (!response.ok) throw new Error('Error al agregar episodio');
      
      const addedEpisode = await response.json();
      setEpisodes([...episodes, addedEpisode]);
      resetEpisodeForm();
      setShowEpisodeModal(false);
      setSuccess('Episodio agregado correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateEpisode = async () => {
    try {
      if (!validateEpisode(newEpisode)) return;
      if (!newEpisode.id) {
        setError('ID de episodio no válido');
        return;
      }
  
      setUploading(true);
      setError(null);
  
      let audioUrl = newEpisode.audio_url;
      if (audioFile) {
        audioUrl = await uploadAudio(audioFile);
      }
  
      const response = await fetch(`${API_URL}/api/podcasts/episodes/${newEpisode.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...newEpisode, 
          audio_url: audioUrl,
          program_id: Number(newEpisode.program_id),
          episode_number: Number(newEpisode.episode_number)
        })
      });
  
      if (!response.ok) throw new Error('Error al actualizar episodio');
  
      const updatedEpisode = await response.json();
      setEpisodes(episodes.map(e => e.id === updatedEpisode.id ? updatedEpisode : e));
      resetEpisodeForm();
      setShowEpisodeModal(false);
      setSuccess('Episodio actualizado correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteEpisode = async (episodeId: number) => {
    try {
      if (!window.confirm('¿Estás seguro de que deseas eliminar este episodio?')) {
        return;
      }
  
      setLoading(true);
      setError(null);
  
      const response = await fetch(`${API_URL}/api/podcasts/episodes/${episodeId}`, {
        method: 'DELETE'
      });
  
      if (!response.ok) throw new Error('Error al eliminar episodio');
  
      setEpisodes(episodes.filter(episode => episode.id !== episodeId));
      setSuccess('Episodio eliminado correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funciones auxiliares
  const resetProgramForm = () => {
    setNewProgram({ 
      title: '', 
      description: '', 
      image_url: '', 
      category: '' 
    });
    setImageFile(null);
  };

  const resetEpisodeForm = () => {
    setNewEpisode({ 
      program_id: programs[0]?.id || 0,
      title: '',
      description: '',
      audio_url: '',
      duration: '',
      episode_number: episodes.length > 0 ? 
        Math.max(...episodes.map(e => e.episode_number)) + 1 : 1,
      publish_date: new Date().toISOString().split('T')[0]
    });
    setAudioFile(null);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <div className="page-content text-white p-4">
      <h2 className="mb-4">Administración de Podcasts</h2>
      
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'programs')} className="mb-3">
        {/* Pestaña de Programas */}
        <Tab eventKey="programs" title="Programas">
          <div className="mt-4">
            <h4>Lista de Programas</h4>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-3">
              {programs.map(program => (
                <div key={program.id} className="col">
                  <div className="card bg-dark text-white h-100">
                    {program.image_url && (
                      <img 
                        src={program.image_url} 
                        className="card-img-top" 
                        alt={program.title}
                        style={{ height: '200px', objectFit: 'cover' }} 
                      />
                    )}
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{program.title}</h5>
                      <p className="card-text flex-grow-1">{program.description}</p>
                      <div className="mt-2">
                        <span className="badge bg-secondary">{program.category}</span>
                      </div>
                      <div className="d-flex justify-content-between mt-3">
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => {
                            setNewEpisode(prev => ({
                              ...prev,
                              program_id: program.id || 0
                            }));
                            setShowEpisodeModal(true);
                          }}
                        >
                          Agregar Episodio
                        </Button>
                        <div>
                          <Button
                            variant="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => {
                              setNewProgram(program);
                              setImageFile(null);
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => program.id && handleDeleteProgram(program.id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-dark rounded">
              <h4>{newProgram.id ? 'Editar Programa' : 'Agregar Nuevo Programa'}</h4>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Título *</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={newProgram.title}
                    onChange={(e) => setNewProgram({...newProgram, title: e.target.value})}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3}
                    value={newProgram.description}
                    onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Imagen del Programa *</Form.Label>
                      <Form.Control 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files && files[0]) {
                            setImageFile(files[0]);
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              setNewProgram({...newProgram, image_url: event.target?.result as string});
                            };
                            reader.readAsDataURL(files[0]);
                          }
                        }}
                        required={!newProgram.id}
                      />
                      {newProgram.image_url && (
                        <div className="mt-2">
                          <img 
                            src={newProgram.image_url} 
                            alt="Vista previa" 
                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                            className="img-thumbnail"
                          />
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Categoría *</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={newProgram.category}
                        onChange={(e) => setNewProgram({...newProgram, category: e.target.value})}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex gap-2 mt-3">
                  <Button 
                    variant="primary" 
                    onClick={newProgram.id ? handleUpdateProgram : handleAddProgram}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Procesando...
                      </>
                    ) : newProgram.id ? 'Actualizar' : 'Agregar'}
                  </Button>
                  {newProgram.id && (
                    <Button 
                      variant="secondary"
                      onClick={resetProgramForm}
                      disabled={uploading}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          </div>
        </Tab>

        {/* Pestaña de Episodios */}
        <Tab eventKey="episodes" title="Episodios">
          <div className="mt-4">
            <h4>Lista de Episodios</h4>
            <div className="table-responsive mt-3">
              <table className="table table-dark table-striped table-hover">
                <thead>
                  <tr>
                    <th>Programa</th>
                    <th>#</th>
                    <th>Título</th>
                    <th>Duración</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {episodes.length > 0 ? (
                    episodes.map(episode => {
                      const program = programs.find(p => p.id === episode.program_id);
                      return (
                        <tr key={episode.id}>
                          <td>{program?.title || 'Programa no encontrado'}</td>
                          <td>{episode.episode_number}</td>
                          <td>{episode.title}</td>
                          <td>{episode.duration}</td>
                          <td>{new Date(episode.publish_date).toLocaleDateString()}</td>
                          <td>
                            <Button 
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => {
                                setNewEpisode(episode);
                                setAudioFile(null);
                                setShowEpisodeModal(true);
                              }}
                            >
                              Editar
                            </Button>
                            <Button 
                              variant="danger"
                              size="sm"
                              onClick={() => episode.id && handleDeleteEpisode(episode.id)}
                            >
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No hay episodios disponibles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Tab>
      </Tabs>

      {/* Modal para Episodios */}
      <Modal show={showEpisodeModal} onHide={() => {
        setShowEpisodeModal(false);
        resetEpisodeForm();
      }} size="lg" centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>
            {newEpisode.id ? 'Editar Episodio' : 'Agregar Nuevo Episodio'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Programa *</Form.Label>
              <Form.Select 
                value={newEpisode.program_id || ''}
                onChange={(e) => setNewEpisode({
                  ...newEpisode,
                  program_id: Number(e.target.value)
                })}
                required
                className="bg-secondary text-white border-dark"
              >
                <option value="">Seleccionar Programa</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Título *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newEpisode.title}
                    onChange={(e) => setNewEpisode({...newEpisode, title: e.target.value})}
                    required
                    className="bg-secondary text-white border-dark"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Número *</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={newEpisode.episode_number}
                    onChange={(e) => setNewEpisode({
                      ...newEpisode,
                      episode_number: Number(e.target.value)
                    })}
                    required
                    className="bg-secondary text-white border-dark"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha *</Form.Label>
                  <Form.Control
                    type="date"
                    value={newEpisode.publish_date}
                    onChange={(e) => setNewEpisode({
                      ...newEpisode,
                      publish_date: e.target.value
                    })}
                    required
                    className="bg-secondary text-white border-dark"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newEpisode.description}
                onChange={(e) => setNewEpisode({...newEpisode, description: e.target.value})}
                className="bg-secondary text-white border-dark"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Duración (detectada automáticamente)</Form.Label>
                <Form.Control
                    type="text"
                    value={newEpisode.duration}
                    readOnly
                    className="bg-secondary text-white border-dark"
                />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Archivo de Audio *</Form.Label>
                  <Form.Control
                    type="file"
                    accept="audio/*"
                    onChange={ async (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files && files[0]) {
                        setAudioFile(files[0]);
                        const duration = await getAudioDuration(files[0]);
                        setNewEpisode(prev => ({
                            ...prev,
                            duration: duration
                        }));
                      }
                    }}
                    required={!newEpisode.id}
                    className="bg-secondary text-white border-dark"
                  />
                  {newEpisode.audio_url && !audioFile && (
                    <div className="mt-2">
                      <audio controls src={newEpisode.audio_url} className="w-100" />
                    </div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowEpisodeModal(false);
              resetEpisodeForm();
            }}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={newEpisode.id ? handleUpdateEpisode : handleAddEpisode}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Procesando...
              </>
            ) : newEpisode.id ? 'Actualizar' : 'Agregar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}