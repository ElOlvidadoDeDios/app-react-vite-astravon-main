import { AuthLogin } from "../types/Auth";

export const validateLoginForm = (
  formData: AuthLogin
): { tempErrors: Partial<AuthLogin>; isValid: boolean } => {
  let tempErrors: Partial<AuthLogin> = {};
  let isValid = true;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!formData.mail.trim()) {
    tempErrors.mail = "El correo es requerido.";
    isValid = false;
  } else if (!emailRegex.test(formData.mail)) {
    tempErrors.mail = "Formato de correo inválido. Ejemplo: usuario@gmail.com";
    isValid = false;
  }

  if (!formData.password.trim()) {
    tempErrors.password = "La contraseña es requerida.";
    isValid = false;
  } 

  return { tempErrors, isValid };
};
