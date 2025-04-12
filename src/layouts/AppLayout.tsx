import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import SidebarAuth from "../modules/auth/pages/SidebarAuth";
import { ToastContainer, Bounce } from "react-toastify";
import { User } from "../types/User";

function AppLayout() {
  const navigate = useNavigate();
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const [user, setUser] = useState<User>();

  // ---------------------------------------------------------------- USER
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed user:", parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);
  
  console.log("Current user state:", user);

  // ---------------------------------------------------------------- SCRIPTS
  useEffect(() => {
    const scriptPaths = [
      "../assets/js/bootstrap.bundle.min.js",
      "../assets/js/jquery.min.js",
      "../assets/plugins/simplebar/js/simplebar.min.js",
      "../assets/plugins/metismenu/js/metisMenu.min.js",
      "../assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js",
      "../assets/plugins/vectormap/jquery-jvectormap-2.0.2.min.js",
      "../assets/plugins/vectormap/jquery-jvectormap-world-mill-en.js",
      "../assets/js/app.js",
    ];

    const loadScript = (path: string) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = path;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const loadScripts = async () => {
      for (const scriptPath of scriptPaths) {
        try {
          await loadScript(scriptPath);
        } catch (error) {
          console.error(`Failed to load script: ${scriptPath}`, error);
        }
      }
      console.log("All scripts loaded successfully.");
    };

    loadScripts();
  }, []);

  //---------------------------------------------------------------- HANDLE LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    setUser(undefined);
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="wrapper">
        <div className="sidebar-wrapper bg-brown" data-simplebar="true">
          <div className="sidebar-header bg-brown">
            <div>
              <img
                src="../../assets/images/logo_small.png"
                className="logo-icon"
                alt="logo icon"
              />
            </div>
            <div>
              <h4 className="logo-text" style={{ fontWeight: "bold" }}>
                Astravon
              </h4>
            </div>
            <div className="toggle-icon ms-auto">
              <i className="bx bx-arrow-back text-white" />
            </div>
          </div>
          <ul className="metismenu" id="menu">
            <li>
              <NavLink to="/">
                <div className="parent-icon">
                  <i className="bx bx-message-dots" />
                </div>
                <div className="menu-title">Foro</div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/podcast">
                <div className="parent-icon">
                  <i className="bx bx-headphone" />
                </div>
                <div className="menu-title">Podcast</div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/schools">
                <div className="parent-icon">
                  <i className="bx bx-buildings" />
                </div>
                <div className="menu-title">Escuelas</div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/activities">
                <div className="parent-icon">
                  <i className="bx bx-time-five" />
                </div>
                <div className="menu-title">Actividades</div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/AdminPanel">
                <div className="parent-icon">
                  <i className="bx bx-time-five" />
                </div>
                <div className="menu-title">Admin Panel Escuelas</div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/PodcastAdminPanel">
                <div className="parent-icon">
                  <i className="bx bx-time-five" />
                </div>
                <div className="menu-title">Admin Panel Podcast</div>
              </NavLink>
            </li>
          </ul>
        </div>
        <header>
          <div className="topbar d-flex align-items-center bg-brown">
            <nav className="navbar navbar-expand gap-3 w-100">
              <div className="nav-search me-auto d-none d-md-flex align-items-center w-25">
                <form
                  className="d-flex align-items-center gap-2 w-100"
                  role="search"
                >
                  <input
                    className="form-control bg-brown-light flex-grow-1 me-2"
                    type="text"
                    placeholder="Buscar..."
                    aria-label="Search"
                  />
                </form>
              </div>

              <div className="mobile-toggle-menu">
                <i className="bx bx-menu" />
              </div>
              <div className="auth-buttons ms-3 d-flex gap-2">
                {!user ? (
                  <>
                    <button
                      className="btn btn-outline-light"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#authSidebar"
                      onClick={() => setAuthType("register")}
                    >
                      Regístrate
                    </button>
                    <button
                      className="btn btn-primary"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#authSidebar"
                      onClick={() => setAuthType("login")}
                    >
                      Iniciar sesión
                    </button>
                  </>
                ) : (
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src="../../assets/images/user.png"
                        className="user-img rounded-circle"
                        alt="user avatar"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div className="user-info">
                        <p className="user-name mb-0 fw-bold text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="designattion mb-0 text-semi-secondary">
                          {user.mail}
                        </p>
                      </div>
                    </div>
                    <button 
                      className="btn btn-outline-light btn-sm" 
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <SidebarAuth tipo={authType} />
        </header>

        <div className="page-wrapper">
          <Outlet />
        </div>
        <div className="overlay toggle-icon" />
        <a href="#" className="back-to-top">
          <i className="bx bxs-up-arrow-alt" />
        </a>
        <footer className="page-footer ">
          <p className="mb-0">
            Copyright © ASTRAVON 2025. Todos los derechos reservados.
          </p>
        </footer>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default AppLayout;