import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types/User";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const userJson = localStorage.getItem("user");
    const user: User | null = userJson ? JSON.parse(userJson) : null;
    
    // Verificar si es el admin por email
    const isAdmin = user?.mail === 'luisabertosanchezvalverde@gmail.com';

    if (!isAuthenticated) {
      navigate("/");
    } else if (adminOnly && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [navigate, adminOnly]);

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userJson = localStorage.getItem("user");
  const user: User | null = userJson ? JSON.parse(userJson) : null;
  const isAdmin = user?.mail === 'luisabertosanchezvalverde@gmail.com';

  if (!isAuthenticated) return null;
  if (adminOnly && !isAdmin) return null;
  
  return <>{children}</>;
};

export default ProtectedRoute;