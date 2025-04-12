import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { createStudent } from "../../services/Student";
import { validateForm } from "../../utils/scheme/StudentValidationsForm";

export function NewStudent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    mail: "",
    phone: "",
    gender: "",
    birthDate: "",
    code: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    mail: "",
    phone: "",
    gender: "",
    birthDate: "",
    code: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.values(validationErrors).every((error) => !error)) {
      try {
        setLoading(true);
        const studentData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dni: formData.dni,
          mail: formData.mail,
          phone: formData.phone,
          gender: formData.gender === "Masculino" ? true : false,
          code: formData.code,
          birthDate: formData.birthDate,
        };

        const response = await createStudent(studentData);
        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "¡Estudiante creado!",
            text: response.message,
            confirmButtonText: "Aceptar",
          });
          navigate("/student/");
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: response.message,
            confirmButtonText: "Aceptar",
          });
        }
        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Opps, Algo salio mal",
          text: "Hubo un error al crear el Estudiante. Por favor, intente nuevamente.",
          confirmButtonText: "Aceptar",
        });
        setLoading(false);
      }
    }
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
                  Nuevo Estudiante
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="card p-4">
          <div className="row">
            <div className="col-sm-3 d-flex flex-column align-items-center text-center">
              <img
                src="../../assets/images/avatars/avatar-3.png"
                alt="Estudiante"
                className="p-1 bg-primary"
                width={200}
              />
            </div>

            <div className="col-sm-9">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-sm-6">
                    <div className="row mb-3">
                      <label
                        htmlFor="input01"
                        className="col-sm-4 col-form-label"
                      >
                        Nombres
                      </label>
                      <div className="col-sm-8">
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            style={{
                              border: errors.firstName ? "1px solid red" : "",
                            }}
                          >
                            <i
                              className={`bx bx-user${
                                errors.firstName ? " text-danger" : ""
                              }`}
                            />
                          </span>

                          <input
                            type="text"
                            className={`form-control ${
                              errors.firstName ? "is-invalid" : ""
                            }`}
                            id="input01"
                            placeholder="Nombre"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.firstName && (
                          <small className="text-danger">
                            {errors.firstName}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label
                        htmlFor="input02"
                        className="col-sm-4 col-form-label"
                      >
                        Apellidos
                      </label>
                      <div className="col-sm-8">
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            style={{
                              border: errors.lastName ? "1px solid red" : "",
                            }}
                          >
                            <i
                              className={`bx bx-user${
                                errors.lastName ? " text-danger" : ""
                              }`}
                            />
                          </span>

                          <input
                            type="text"
                            className={`form-control ${
                              errors.lastName ? "is-invalid" : ""
                            }`}
                            id="input02"
                            placeholder="Apellidos"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.lastName && (
                          <small className="text-danger">
                            {errors.lastName}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label
                        htmlFor="input07"
                        className="col-sm-4 col-form-label"
                      >
                        DNI
                      </label>
                      <div className="col-sm-8">
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            style={{
                              border: errors.dni ? "1px solid red" : "",
                            }}
                          >
                            <i
                              className={`bx bx-id-card${
                                errors.dni ? " text-danger" : ""
                              }`}
                            />
                          </span>

                          <input
                            type="text"
                            className={`form-control ${
                              errors.dni ? "is-invalid" : ""
                            }`}
                            id="input07"
                            placeholder="DNI"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.dni && (
                          <small className="text-danger">{errors.dni}</small>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label
                        htmlFor="input07"
                        className="col-sm-4 col-form-label"
                      >
                        CODIGO
                      </label>
                      <div className="col-sm-8">
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            style={{
                              border: errors.code ? "1px solid red" : "",
                            }}
                          >
                            <i
                              className={`bx bx-id-card${
                                errors.code ? " text-danger" : ""
                              }`}
                            />
                          </span>

                          <input
                            type="number"
                            className={`form-control ${
                              errors.code ? "is-invalid" : ""
                            }`}
                            id="input07"
                            placeholder="code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.code && (
                          <small className="text-danger">{errors.code}</small>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="row mb-3">
                      <label
                        htmlFor="input09"
                        className="col-sm-4 col-form-label"
                      >
                        Correo Electrónico
                      </label>
                      <div className="col-sm-8">
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            style={{
                              border: errors.mail ? "1px solid red" : "",
                            }}
                          >
                            <i
                              className={`bx bx-envelope${
                                errors.mail ? " text-danger" : ""
                              }`}
                            />
                          </span>

                          <input
                            type="text"
                            className={`form-control ${
                              errors.mail ? "is-invalid" : ""
                            }`}
                            id="input09"
                            placeholder="Email"
                            name="mail"
                            value={formData.mail}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.mail && (
                          <small className="text-danger">{errors.mail}</small>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label
                        htmlFor="input10"
                        className="col-sm-4 col-form-label"
                      >
                        Teléfono
                      </label>
                      <div className="col-sm-8">
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            style={{
                              border: errors.phone ? "1px solid red" : "",
                            }}
                          >
                            <i
                              className={`bx bx-phone${
                                errors.phone ? " text-danger" : ""
                              }`}
                            />
                          </span>

                          <input
                            type="text"
                            className={`form-control ${
                              errors.phone ? "is-invalid" : ""
                            }`}
                            id="input10"
                            placeholder="Número de teléfono"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.phone && (
                          <small className="text-danger">{errors.phone}</small>
                        )}
                      </div>
                    </div>

                    <div className="row mb-3">
                      <label
                        htmlFor="input05"
                        className="col-sm-4 col-form-label"
                      >
                        Género
                      </label>
                      <div className="col-sm-8">
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            style={{
                              border: errors.gender ? "1px solid red" : "",
                            }}
                          >
                            <i
                              className={`bx bx-user-circle${
                                errors.gender ? " text-danger" : ""
                              }`}
                            />
                          </span>

                          <select
                            className={`form-select ${
                              errors.gender ? "is-invalid" : ""
                            }`}
                            id="input05"
                            value={formData.gender}
                            onChange={handleChange}
                            name="gender"
                          >
                            <option value="">Seleccionar género</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                          </select>
                        </div>
                        {errors.gender && (
                          <small className="text-danger">{errors.gender}</small>
                        )}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label
                        htmlFor="input07"
                        className="col-sm-4 col-form-label"
                      >
                        fecha de nacimiento
                      </label>
                      <div className="col-sm-8">
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            style={{
                              border: errors.birthDate ? "1px solid red" : "",
                            }}
                          >
                            <i
                              className={`bx bx-id-card${
                                errors.birthDate ? " text-danger" : ""
                              }`}
                            />
                          </span>

                          <input
                            type="date"
                            className={`form-control ${
                              errors.birthDate ? "is-invalid" : ""
                            }`}
                            id="input07"
                            placeholder="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.birthDate && (
                          <small className="text-danger">
                            {errors.birthDate}
                          </small>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col"></div>
                    <div className="col-auto ml-auto">
                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            />{" "}
                            Registrando...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-user-circle" /> Registrar
                            estudiante
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
