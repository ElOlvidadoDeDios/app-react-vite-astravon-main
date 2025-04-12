import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [navigate]);

  return localStorage.getItem("isAuthenticated") === "true" ? (
    <>{children}</>
  ) : null;
};

export default ProtectedRoute;
  