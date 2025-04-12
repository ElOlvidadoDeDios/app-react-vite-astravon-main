import { Spinner } from "react-bootstrap";

export function Loader(): JSX.Element {
  return (
    <div
      className="d-flex justify-content-center align-items-center my-4"
      style={{ height: "200px" }} 
    >
      <Spinner
        animation="border"
        role="status"
        variant="light"
        style={{ width: "2rem", height: "2rem" }} 
      >
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    </div>
  );
}
