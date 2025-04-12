const dniRegex = /^[0-9]{8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^9\d{8}$/;
const passwordRegex = /^.{8,}$/;

export const validateRequiredField = (
  value: string | undefined
): string | undefined => {
  return value ? undefined : "Este campo es requerido.";
};

export const validateDNI = (value: string | undefined): string | undefined => {
  return value && !dniRegex.test(value)
    ? "Por favor ingrese un DNI válido (8 dígitos numéricos)."
    : undefined;
};

export const validateEmail = (
  value: string | undefined
): string | undefined => {
  return value && !emailRegex.test(value)
    ? "Por favor ingrese un correo electrónico válido."
    : undefined;
};

export const validatePhoneNumber = (
  value: string | undefined
): string | undefined => {
  return value && !phoneRegex.test(value)
    ? "Por favor ingrese un número de teléfono válido (09 dígitos numéricos)."
    : undefined;
};

export const validatePassword = (
  value: string | undefined
): string | undefined => {
  return value && !passwordRegex.test(value)
    ? "La contraseña debe tener al menos 8 caracteres."
    : undefined;
};

export const validatePositiveNumber = (
  value: number | undefined
): string | undefined => {
  return value && value > 0
    ? undefined
    : "Por favor ingrese un número positivo mayor que cero.";
};
