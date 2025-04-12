import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

import { FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  actualizarStudent,
  eliminarStudent,
  getAllStudent,
} from "../../services/Student";
import { Student } from "../../types/Student";
import { validateForm } from "../../utils/scheme/StudentValidationsForm";
import { Loading } from "../../components/ui/Loader";

export function Students() {
  const [student, setStudent] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formErrors, setFormErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const indexOfLastCliente = currentPage * studentPerPage;
  const indexOfFirstCliente = indexOfLastCliente - studentPerPage;
  const currentStudent = student.slice(indexOfFirstCliente, indexOfLastCliente);

  const totalPages = Math.ceil(student.length / studentPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const filteredStudent = currentStudent.filter((student) =>
    Object.values(student).some((value) =>
      value
        ? value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        : false
    )
  );

  //---------------------------------------------------------------- GET STUDENT
  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllStudent();
      if (data == null) {
        setStudent([]);
      } else {
        setStudent(data);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  //---------------------------------------------------------------- DELETE STUDENT
  const handleDeleteStudent = async (id: number) => {
    try {
      const confirmacion = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo",
        cancelButtonText: "Cancelar",
      });

      if (confirmacion.isConfirmed) {
        const response = await eliminarStudent(id);
        if (!response.success) {
          throw new Error(response.message);
        }

        const updatedStudent = student.filter(
          (student) => student.idStudent !== id
        );
        setStudent(updatedStudent);
        await Swal.fire("¡Eliminado!", response.message, "success");
      }
    } catch (error) {
      Swal.fire("Error", "Oppss, algo salio mal!", "error");
    }
  };

  //---------------------------------------------------------------- EDIT STUDENT
  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedStudent(null);
    setFormErrors({});
  };

  const saveChanges = async () => {
    if (selectedStudent?.idStudent) {
      const errors = validateForm(selectedStudent);
      setFormErrors(errors);

      if (Object.values(errors).some((error) => error !== "")) {
        return;
      }

      try {
        const response = await actualizarStudent(selectedStudent);
        if (!response.success) {
          throw new Error(response.message);
        }
        setStudent(
          student.map((user) =>
            user.idStudent === selectedStudent.idStudent
              ? selectedStudent
              : user
          )
        );
        Swal.fire("Actualizado", response.message, "success");
      } catch (error) {
        Swal.fire("Error", "Oppss, algo salió mal!", "error");
      }
    }

    setModalIsOpen(false);
    setSelectedStudent(null);
    setFormErrors({});
  };

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
          <div className="breadcrumb-title pe-3">Estudiante</div>
          <div className="ps-3">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0 p-0">
                <li className="breadcrumb-item">
                  <a href="#">
                    <i className="bx bx-home-alt" />
                  </a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Todos los estudiantes
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar estudiante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div
          className="table-responsive"
          style={{ maxHeight: "500px", overflowY: "auto" }}
        >
          {loading ? (
            <Loading />
          ) : filteredStudent.length === 0 ? (
            <div className="text-center">Sin estudiantes</div>
          ) : (
            <table
              className="table table-striped table-bordered"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th>DNI</th>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Mail</th>
                  <th>Telefono</th>
                  <th>Género</th>
                  <th>Codigo</th>
                  <th>Cumpleaños</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudent.map((student, index) => (
                  <tr key={index}>
                    <td>{student.dni}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.mail}</td>
                    <td>{student.phone}</td>
                    <td>{student.gender ? "Masculino" : "Femenino"}</td>
                    <td>{student.code}</td>
                    <td>{student.birthDate}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ marginRight: "6px" }}
                        title="Editar"
                        onClick={() => handleEditStudent(student)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleDeleteStudent(student.idStudent || 0)
                        }
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && student.length > 0 && (
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
              >
                <FaChevronLeft />
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 && "active"}`}
              >
                <button
                  onClick={() => paginate(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages && "disabled"
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
              >
                <FaChevronRight />
              </button>
            </li>
          </ul>
        )}
      </div>

      <Modal show={modalIsOpen} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Estudiante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <form>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">
                      Nombre(s) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      value={selectedStudent.firstName}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          firstName: e.target.value,
                        })
                      }
                    />
                    {formErrors.firstName && (
                      <small className="text-danger">
                        {formErrors.firstName}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Apellido(s) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      value={selectedStudent.lastName}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          lastName: e.target.value,
                        })
                      }
                    />
                    {formErrors.lastName && (
                      <small className="text-danger">
                        {formErrors.lastName}
                      </small>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="dni" className="form-label">
                  DNI <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="dni"
                  value={selectedStudent.dni}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      dni: e.target.value,
                    })
                  }
                />
                {formErrors.dni && (
                  <small className="text-danger">{formErrors.dni}</small>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="mail" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="mail"
                  value={selectedStudent.mail}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      mail: e.target.value,
                    })
                  }
                />
                {formErrors.mail && (
                  <small className="text-danger">{formErrors.mail}</small>
                )}
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">
                    Teléfono <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    value={selectedStudent.phone}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        phone: e.target.value,
                      })
                    }
                  />
                  {formErrors.phone && (
                    <small className="text-danger">{formErrors.phone}</small>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="gender" className="form-label">
                    Género <span className="text-danger">*</span>
                  </label>
                  <select
                    id="gender"
                    className="form-control"
                    value={selectedStudent.gender ? "Masculino" : "Femenino"}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        gender: e.target.value === "Masculino",
                      })
                    }
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                  {formErrors.gender && (
                    <small className="text-danger">{formErrors.gender}</small>
                  )}{" "}
                </div>
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={saveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
