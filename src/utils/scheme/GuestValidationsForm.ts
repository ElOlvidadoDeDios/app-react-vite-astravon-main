export const validateForm = (formData: any) => {
  const errors: any = {};

  errors.firstName = formData.firstName ? "" : "Este campo es obligatorio";
  errors.lastName = formData.lastName ? "" : "Este campo es obligatorio";
  if (!formData.dni) {
    errors.dni = "Este campo es obligatorio";
  } else if (!/^\d{8}$/.test(formData.dni)) {
    errors.dni = "El DNI debe tener 8 dígitos numéricos";
  } else {
    errors.dni = "";
  }
      
  return errors;
};
