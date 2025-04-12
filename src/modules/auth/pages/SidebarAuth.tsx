import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

interface SidebarAuthProps {
  tipo: "login" | "register";
}

function SidebarAuth({ tipo }: SidebarAuthProps) {
  return (
    <div
      className="offcanvas offcanvas-end bg-sidebar text-white px-4 py-3"
      id="authSidebar"
      style={{
        backgroundImage: "url('../../assets/images/bg/prueba.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="offcanvas-header">
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body d-flex flex-column align-items-center">
        <div className="d-flex align-items-center">
          <img
            src="../../assets/images/logo.png"
            alt="Logo"
            className="me-2"
            style={{ width: "40px", height: "35px" }}
          />
          <h5 className="text-white mb-0">stravon</h5>{" "}
        </div>

        <p className="mb-4">Ingresar o crear una cuenta aquí</p>
        {tipo === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}

export default SidebarAuth;
