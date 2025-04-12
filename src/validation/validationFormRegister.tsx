import { User } from "../types/User";

export const validateRegisterForm = (
  formData: User
): { tempErrors: Partial<User>; isValid: boolean } => {
  let tempErrors: Partial<User> = {};
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
  } else {
    let errorMessage = "";
    if (formData.password.length < 8)
      errorMessage += "Debe tener al menos 8 caracteres. ";
    if (!/[A-Z]/.test(formData.password))
      errorMessage += "Debe incluir una letra mayúscula. ";
    if (!/[0-9]/.test(formData.password))
      errorMessage += "Debe incluir un número. ";
    if (!/[@$!%*?&]/.test(formData.password))
      errorMessage += "Debe incluir un carácter especial (@$!%*?&).";

    if (errorMessage) {
      tempErrors.password = errorMessage.trim();
      isValid = false;
    }
  }

  if (!formData.firstName.trim()) {
    tempErrors.firstName = "El nombre es requerido.";
    isValid = false;
  } else if (formData.firstName.length < 2) {
    tempErrors.firstName = "El nombre debe tener al menos 2 caracteres.";
    isValid = false;
  }

  if (!formData.lastName.trim()) {
    tempErrors.lastName = "Los apellidos son requeridos.";
    isValid = false;
  } else if (formData.lastName.length < 2) {
    tempErrors.lastName = "Los apellidos deben tener al menos 2 caracteres.";
    isValid = false;
  }
  return { tempErrors, isValid };
};

export const validateEmailOnly = (email: string) => {
  let errors: { mail?: string } = {};
  let isValid = true;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email.trim()) {
    errors.mail = "El correo es requerido.";
    isValid = false;
  } else if (!emailRegex.test(email)) {
    errors.mail = "Formato de correo inválido. Ejemplo: usuario@gmail.com";
    isValid = false;
  }

  return { errors, isValid };
};
