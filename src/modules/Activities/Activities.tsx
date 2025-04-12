import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import ActivitiesRadio from "./components/ActivitiesRadio";
import ActivitiesSostenibilidad from "./components/ActivitiesSostenibilidad";
import ActivitiesCrearContenido from "./components/ActivitiesCrearContenido";

export function Activities() {
  const [selectedComponent, setSelectedComponent] = useState<string>("radio");

  return (
    <div className="page-content">
      <h6 className="mb-0 text-uppercase text-white">
        En desarrollo...
      </h6>
      <hr />

      {/*<div className="d-flex justify-content-start my-3">
        <button
          className={`btn mr-4 ${
            selectedComponent === "radio"
              ? "btn-primary"
              : "btn-outline-secondary"
          }`}
          onClick={() => setSelectedComponent("radio")}
        >
          Radio
        </button>
        <button
          className={`btn mx-3 ${
            selectedComponent === "sostenibilidad"
              ? "btn-primary"
              : "btn-outline-secondary"
          }`}
          onClick={() => setSelectedComponent("sostenibilidad")}
        >
          Sostenibilidad
        </button>
        <button
          className={`btn  ${
            selectedComponent === "crearContenido"
              ? "btn-primary"
              : "btn-outline-secondary"
          }`}
          onClick={() => setSelectedComponent("crearContenido")}
        >
          Crear Contenido
        </button>
      </div>*/}
      {selectedComponent === "radio" && <ActivitiesRadio />}
      {selectedComponent === "sostenibilidad" && <ActivitiesSostenibilidad />}
      {selectedComponent === "crearContenido" && <ActivitiesCrearContenido />}
    </div>
  );
}
